import * as puppeteer from "puppeteer";

/**
 * Interfaces
 */
export interface MemberProfile {
  id: string;
  first_name: string;
  last_name: string;
  dob: string;
  age_category: string;
  is_anonymous: Boolean;
  writable_attributes: Array<string>;
  effective_age: Number;
}
export interface GroupMember {
  id: string;
  created_at: string;
  is_admin: Boolean;
  is_guest: Boolean;
  pending_invite: Boolean;
  is_participant: Boolean;
  is_active_participant: Boolean;
  profile: MemberProfile;
}
export interface GetUsersPayload {
  data: {
    id: Number;
    group_members: Array<GroupMember>;
  };
  errors: Array<String>;
}

export interface MiddlewareHandlers {
  getUsers?: (request: puppeteer.Request) => Promise<void> | undefined;
  getDestinationAvailability?: (request: puppeteer.Request) => Promise<void>;
}
