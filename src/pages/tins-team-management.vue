<script setup lang="ts">
import { fetchJSONOrThrow, postOrThrow } from '../util.js';
import { usePromise } from '../usePromise.js';
import { computed, ref, watch } from 'vue';

type InvitationType = {
	id: number,
	senderName: string,
	entryId: number,
	recipientEntrantId: number,
	recipientName: string,
};
type InvitationsType = { toMe: InvitationType[], fromMe: InvitationType[] };
type MyEntryType = {
	id?: string,
	entrants?: { id: number, name: string }[],
};

const props = defineProps<{ compoId: string }>();
const compoId = computed(() => props.compoId);

const data = usePromise<{
	entry: MyEntryType,
	invitations: InvitationsType,
}>();

const breadcrumbs = computed(() => [
	{ url: `/${compoId.value}/`, title: compoId.value },
	{ title: 'Team Management' }
]);

watch(compoId, () => {
	refresh();
}, { immediate: true });

async function refresh() {
	data.doAsync(
		async () => {
			try {
				const invitations: InvitationsType = await fetchJSONOrThrow(`/api/v1/invitation/byCompo/${compoId.value}`);
				const response = await postOrThrow(`/api/v1/compo/${compoId.value}/myEntry`, '');
				const myEntry = await response.json();
				const { entryId } = myEntry;
				const entry: MyEntryType = await fetchJSONOrThrow(`/api/v1/entry/${entryId}/`);

				return { invitations, entry };
			}
			catch(e) {
				throw new Error('Could not get or team management data');
			}
		}
	);
}

const entry = computed(() => data.result.value?.entry || {});
const invitations = computed(() => data.result.value?.invitations.toMe || []);
const pendingInvitations = computed(() => data.result.value?.invitations.fromMe || []);
const invitationOpen = ref(false);
const allEntrants = usePromise<{ entrantId: number, username: string }[]>();
const inviteeSelectElt = ref(null);

async function openInvitationSelect() {
	allEntrants.doAsync(async () => {
		const response = await fetch(`/api/v1/compo/${compoId.value}/entrants?simple=true`);
		const { result } = await response.json();
		// TODO: filter self, filter invitees, filter team members
		invitationOpen.value = true;
		return result;
	});
}

async function sendInvitation() {
	const selectedRecipient = inviteeSelectElt.value.value;
	try {
		await postOrThrow('/api/v1/invitation/create',
			JSON.stringify({
				'entryId': entry.value.id,
				'recipientEntrantId': selectedRecipient
			})
		);
		refresh();
	}
	catch (e) {
		//TODO: nicer error handling
		alert(`${e}`);
	}
	invitationOpen.value = false;
}

async function resolve(invitation: { id: number }, isAccept: boolean) {
	await postOrThrow(`/api/v1/invitation/id/${invitation.id}/resolve`, JSON.stringify({ resolution: isAccept ? 'accept' : 'reject' }));
	refresh();
}

async function leaveTeam() {
	if (window.confirm('Are you sure you want to leave this team and go by yourself?')) {
		try {
			const currentEntrantResponse = await fetchJSONOrThrow<{ entrantId: string }>(`/api/v1/compo/${compoId.value}/currentEntrant`);
			await postOrThrow(`/api/v1/removeTeamMember/${currentEntrantResponse.entrantId}`, '');
			refresh();
		}
		catch(e) {
			alert(`${e}`);
		}
	}
}
</script>
<template>
	<div class="tins-team-management">
		<tins-breadcrumbs :data="breadcrumbs"></tins-breadcrumbs>
		<tins-status-helper :error="data.error.value" :loading="data.loading.value">
			<p v-if="entry.entrants">Your current team:
				<ol>
					<li v-for="e of entry.entrants" :key="e.id">{{e.name}}</li>
				</ol>
				<span v-if="entry.entrants.length === 1">(You're all by yourself)</span>
				<button v-else @click="leaveTeam">Leave team</button>
			</p>

			<template v-if="invitations">
				<p v-for="e of invitations" :key="e.id">You've been invited to join the team of {{e.senderName}}.
					Do you <button @click="() => resolve(e, true)">Accept</button>
					or <button @click="() => resolve(e, false)">Reject</button>?
				</p>
			</template>

			<div v-if="invitationOpen">
				<select name="invitees" ref="inviteeSelectElt">
					<option value="">--Please choose an option--</option>
					<option v-for="e of allEntrants.result.value" :key="e.entrantId" :value="e.entrantId">{{e.username}}</option>
				</select>
				<button @click="sendInvitation">Send Invitation</button>
			</div>
			<div v-else>
				<button @click="openInvitationSelect">Invite somebody else</button>
			</div>


			<p v-if="(pendingInvitations && pendingInvitations.length > 0)">Pending invitations (waiting to be accepted):
				<ul>
					<li v-for="e of pendingInvitations" :key="e.recipientEntrantId">{{e.recipientName}}</li>
				</ul>
			</p>

		</tins-status-helper>
	</div>
</template>
<style scoped>
	.tins-team-management .error {
		width: 100%;
		color: red;
	}
</style>
