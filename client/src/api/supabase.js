import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
    process.env.REACT_APP_SUPABASE_DOMAIN,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

const getProjects = async () => {
    const { data } = await supabaseClient.from("terrain_entries").select(`id, name`);
    //const data = [];
    //console.log(data);
    return data;
};

const getProjectById = async (id) => {
    const { data } = await supabaseClient.from("terrain_entries").select(`id, name, terrain_string`).eq('id', id);
    return data;
}

const createProject = async (project) => {
    if (!project) {
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from("terrain_entries")
            .upsert({ name: project.name,  terrain_string: ''})
            .select()
        //console.log(data);
        return data;
    } catch (e) {
        console.log(e);
        return [];
    }
}

const editProject = async (oldProject, newProject) => {
    if (!oldProject || !newProject) {
        return;
    }
    try {
        const { data, error } = await supabaseClient
            .from("terrain_entries")
            .update({ name: newProject.name})
            .eq('id', oldProject.id)
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

const deleteProject = async (project) => {
    if (!project) {
        return;
    }
    try {
        const { data, error } = await supabaseClient
            .from("terrain_entries")
            .delete()
            .eq('id', project.id)
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export { getProjects, getProjectById, createProject, editProject, deleteProject };