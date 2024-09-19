import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Member {
    id: number
    firstName: string
    lastName: string
}

export const useMembersStore = defineStore('Members', () => {
    const members = ref<Member[]>([
        {
            id: 1,
            firstName: 'First Name 1',
            lastName: 'Last Name 1',
        },
        {
            id: 2,
            firstName: 'First Name 2',
            lastName: 'Last Name 2',
        },
        {
            id: 3,
            firstName: 'First Name 3',
            lastName: 'Last Name 3',
        },
    ]);
    const memberToEdit = ref<Member | null>(null);

    const countMembers = computed(() => members.value.length);
    const member = (value) => members.value.find(item => item.id === value);

    const addMember = (member: Omit<Member, 'id'>) => {
        members.value.push({ ...member, id: Date.now() });
    };

    const updateMember = (updatedMember: Member) => {
        const index = members.value.findIndex(member => member.id === updatedMember.id);

        if (index !== -1) {
            members.value[index] = updatedMember;
            console.log(members)
        }
    };

    const deleteMember = (memberId: number) => {
        members.value = members.value.filter(member => member.id !== memberId);
    };

    return {
        members,
        memberToEdit,
        countMembers,
        member,
        addMember,
        updateMember,
        deleteMember,
    };
});
