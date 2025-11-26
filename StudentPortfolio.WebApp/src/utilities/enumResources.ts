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
