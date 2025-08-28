
import { ApiHelpers } from '$lib/server/db/models/index.js';
import { api } from '$lib/services/ApiService.svelte.js';
import { redirect } from '@sveltejs/kit';

export async function load({ parent, locals }) {
  
  if (locals.user) {
     const data =  JSON.stringify(await ApiHelpers.getAvailableCampaigns(locals.user._id))
     return {
      availableCampaigns:JSON.parse(data)
     }
  }else{
    redirect(301, '/login')
  }
}