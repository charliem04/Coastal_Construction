/**
 * The contact form's "When Do You Need Service?" options, in order.
 *
 * Moved from contact.html. The old form's <option> values had drifted
 * from their visible labels ("Urgent (1-2 weeks)" was sent for "Urgent
 * (Within 1-2 weeks)", "Just planning ahead" for "Just Planning Ahead").
 * Now the label is what is sent, so the email says exactly what the
 * visitor picked.
 *
 * The rebuild brief writes the first as "Emergency – ASAP" (en dash);
 * the live form has a plain hyphen, which is what is kept here.
 */
export const timelines = [
  "Emergency - ASAP",
  "Urgent (Within 1-2 weeks)",
  "Soon (Within 1 month)",
  "Flexible (1-3 months)",
  "Just Planning Ahead",
] as const;
