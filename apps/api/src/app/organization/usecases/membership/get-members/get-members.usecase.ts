import { Injectable, Scope } from '@nestjs/common';
import { MemberRepository } from '@notify/dal';
import { MemberRoleEnum, MemberStatusEnum } from '@notify/shared';
import { GetMembersCommand } from './get-members.command';

@Injectable({
  scope: Scope.REQUEST,
})
export class GetMembers {
  constructor(private membersRepository: MemberRepository) {}

  async execute(command: GetMembersCommand) {
    return (await this.membersRepository.getOrganizationMembers(command.organizationId))
      .map((member) => {
        if (!command.user.roles.includes(MemberRoleEnum.OSS_ADMIN)) {
          if (member.memberStatus === MemberStatusEnum.INVITED) return null;
          if (member.user) member.user.email = '';
          if (member.invite) member.invite.email = '';
        }

        return member;
      })
      .filter((member) => !!member);
  }
}
