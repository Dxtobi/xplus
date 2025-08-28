import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

export const user = writable(null);

export function requireAuth() {
  if (browser) {
    user.subscribe(value => {
      if (value === null) {
        goto('/login');
      }
    });
  }
}