import {
  acknowledgementType,
  type AcknowledgementTypeValues,
} from "../types/dtos/acknowledgement";

export const AcknowledgementTypeResc: Record<
  AcknowledgementTypeValues,
  string
> = {
  [acknowledgementType.Other]: "Other Event",
  [acknowledgementType.Investigation]: "Investigation",
  [acknowledgementType.Competition]: "Competition",
  [acknowledgementType.Internship]: "Internship",
  [acknowledgementType.Athlete]: "Athletic Participation",
  [acknowledgementType.Lidership]: "Demonstration of Lidership",
} as const;

export const AcknowledgementTypePluralResc: Record<
  AcknowledgementTypeValues,
  string
> = {
  [acknowledgementType.Other]: "Other Event",
  [acknowledgementType.Investigation]: "Investigations",
  [acknowledgementType.Competition]: "Competitions",
  [acknowledgementType.Internship]: "Internships",
  [acknowledgementType.Athlete]: "Athletic Participations",
  [acknowledgementType.Lidership]: "Demonstrations of Lidership",
} as const;
