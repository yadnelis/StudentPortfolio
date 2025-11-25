import {
  AcknowledgementType,
  type AcknowledgementTypeValues,
} from "../types/dtos/acknowledgement";

export const AcknowledgementTypeResc: Record<
  AcknowledgementTypeValues,
  string
> = {
  [AcknowledgementType.Other]: "Other Event",
  [AcknowledgementType.Investigation]: "Investigation",
  [AcknowledgementType.Competition]: "Competition",
  [AcknowledgementType.Internship]: "Internship",
  [AcknowledgementType.Athlete]: "Athletic Participation",
  [AcknowledgementType.Lidership]: "Demonstration of Lidership",
} as const;
