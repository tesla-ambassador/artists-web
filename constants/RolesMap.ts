import { CollaboratorRole } from "@/zeus/types/song";

export const RoleOptionsList: Array<{
  label: string;
  value: CollaboratorRole;
}> = [
  { label: "Artist", value: CollaboratorRole.PRIMARY_ARTIST },
  { label: "Performer", value: CollaboratorRole.PERFORMER },
  { label: "Producer", value: CollaboratorRole.PRODUCER },
  { label: "Remixer", value: CollaboratorRole.REMIXER },
  { label: "Composer", value: CollaboratorRole.COMPOSER },
  { label: "Lyricist", value: CollaboratorRole.LYRICIST },
  { label: "Publisher", value: CollaboratorRole.PUBLISHER },
  { label: "Featuring", value: CollaboratorRole.FEATURING_WITH },
  { label: "Conductor", value: CollaboratorRole.CONDUCTOR },
  { label: "Arranger", value: CollaboratorRole.ARRANGER },
  { label: "Orchestra", value: CollaboratorRole.ORCHESTRA },
  { label: "Actor", value: CollaboratorRole.ACTOR },
  { label: "Agent", value: CollaboratorRole.AGENT },
  { label: "Promoter", value: CollaboratorRole.PROMOTER },
  { label: "Beneficiary", value: CollaboratorRole.BENEFICIARY },
];
