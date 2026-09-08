import { mockCommunities } from "../data/mockCommunity";
import { uid, delay } from "../utils";

let _communities = [...mockCommunities];

export async function getCommunities() {
  await delay();
  return [..._communities];
}

export async function addCommunity(communityDraft: any) {
  await delay();
  const newCommunity = {
    id: uid("com"),
    visibility: "Public",
    members: [],
    ...communityDraft,
  };
  _communities = [newCommunity, ..._communities];
  return newCommunity;
}

export async function updateCommunity(id: string, patch: any) {
  await delay();
  _communities = _communities.map((c) => (c.id === id ? { ...c, ...patch } : c));
  return _communities.find((c) => c.id === id);
}

export async function deleteCommunity(id: string) {
  await delay();
  _communities = _communities.filter((c) => c.id !== id);
  return { id };
}

export async function addMember(communityId: string, member: any) {
  await delay(200);
  const newMember = { id: uid("mem"), role: "Member", ...member };
  _communities = _communities.map((c) =>
    c.id === communityId ? { ...c, members: [...c.members, newMember] } : c
  );
  return newMember;
}

export async function removeMember(communityId: string, memberId: string) {
  await delay(200);
  _communities = _communities.map((c) =>
    c.id === communityId
      ? { ...c, members: c.members.filter((m: any) => m.id !== memberId) }
      : c
  );
  return { memberId };
}
