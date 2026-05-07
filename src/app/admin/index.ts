import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Initialize Supabase client with the user's JWT to verify identity
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'No authorization header' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            })
        }

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )

        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

        // Security Check: Ensure the user is an ADMIN
        if (authError || user?.user_metadata?.role !== 'ADMIN') {
            return new Response(JSON.stringify({ error: 'Unauthorized: Admin privileges required' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            })
        }

        // 2. Initialize Admin client with Service Role to bypass RLS for bulk updates
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 3. Perform bulk activation logic
        // We assume 'profiles' is the table where tutor status is managed
        const { data, error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({ status: 'active', is_verified: true })
            .eq('role', 'TUTOR')
            .eq('status', 'pending')
            .select()

        if (updateError) throw updateError

        const activatedCount = data?.length || 0;

        return new Response(JSON.stringify({
            message: activatedCount > 0 ? `Successfully activated ${activatedCount} tutors` : "No pending tutors found to activate.",
            tutors: data?.map(t => t.full_name || t.email || 'Unknown User') || []
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})