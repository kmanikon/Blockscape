import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
    process.env.REACT_APP_SUPABASE_DOMAIN,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

const getProjects = async () => {
    //const { data } = await supabaseClient.from("terrain_entries").select(`id, name`);
    const data = [];
    //console.log(data);
    return data;
};

export { getProjects };