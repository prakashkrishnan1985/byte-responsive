const usedThinkingIndices = new Map();

export const thinkingVariants = {
  inputMethod: (value) => [
    `They chose to ${value?.toLowerCase() || '...'} — next up, get their name for a more human touch.`,
    `${value} selected. Now, what's their name? Makes everything less robotic.`,
    `Input method locked in: ${value}. Time to ask who I'm talking to.`,
    `Alright, ${value} it is. Let's follow that up by asking their name.`,
    `So, ${value.toLowerCase()} it is. I should now make it more personal.`,
    `They went with ${value}. Names matter — let's get theirs.`,
    `Got it. They prefer to ${value.toLowerCase()}. Let's build some rapport with a name.`,
    `The user prefers to ${value.toLowerCase()}. Now I should get their name so I can personalize our conversation.`
  ],
  name: (value) => [
    `They go by ${value || '...'} — that's a start! Email next, but no pressure.`,
    `Name captured: ${value}. A good moment to ask for an email.`,
    `Cool, ${value} it is. I'll casually ask for an email now.`,
    `Nice. Now let's gently nudge toward getting an email (optional of course).`,
    `Logged their name as ${value}. That opens the door to asking for an email.`,
    `We're on a first-name basis now: ${value}. Let's prompt for email.`,
    `Step one complete: got their name. Now I'll suggest an optional email.`
  ],
  email: (value) => {
    if (!value?.trim()) {
      return [
        `They skipped the email. All good — time to ask for photo consent.`,
        `No email given. I'll move on to asking about the photo.`,
        `Email's optional anyway — next, ask for photo permission.`,
        `They chose not to share an email. Let's not hold up the flow.`,
        `Privacy respected. Onward to checking photo consent.`,
        `No email input — let's see if they're cool with a snapshot.`,
        `Blank email field. No worries. Moving to the next interaction point.`
      ];
    }
    return [
      `Got their email: ${value}. Let's ask if I can take a photo.`,
      `Email received. I'll check if they're okay with a quick snapshot.`,
      `Email in the bag — now to see if a smile is in our future.`,
      `They entered ${value}. Time to ask about photo permission.`,
      `Now that I have their email, I can prompt for camera access.`,
      `${value} added. Next step: photo consent.`,
      `That email works. Let's transition to photo permission.`
    ];
  },
  consentToPhoto: (value) => value
    ? [
        `They agreed to the photo — setting up the camera now.`,
        `Photo consent granted. Initiating smile detection.`,
        `Perfect! They're up for a picture. Getting things ready.`,
        `Got the go-ahead for a photo. Let's see that smile.`,
        `Photo? Yes. Let's power up the camera.`,
        `Permission confirmed. Preparing the snapshot sequence.`,
        `They're okay with the photo. Time to make it work.`
      ]
    : [
        `They'd rather skip the photo — totally fine.`,
        `No photo? No problem. Let's move on.`,
        `They declined the photo. Respect that and continue.`,
        `Skipping the camera step. Plenty more to cover.`,
        `No photo access — that's their call. Onward.`,
        `They're not comfortable with a photo. All good.`,
        `Not taking a photo. I'll pivot to the tone question.`
      ],
  welcomeMessage: () => [
    `Intro done. Time to ask how I should sound.`,
    `Now that we've met, let's talk tone.`,
    `We're almost set — just need to pick a voice style.`,
    `One last bit: picking a tone for how I'll respond.`,
    `We've covered the basics. Now let's personalize the voice.`,
    `Great progress. Final step: tone of voice.`,
    `Now I just need to know how I should *sound*.`
  ],
  default: () => [
    `Thinking about the next best step to keep this flowing...`,
    `Hmm... figuring out what makes sense to ask next.`,
    `Just taking a second to plan the next move.`,
    `Let me process that and decide what's next.`,
    `A quick moment to reflect before the next question.`,
    `Mapping out the smoothest way forward...`,
    `Loading the next thoughtful question...`
  ]
};

export const getUniqueThinkingMessage = (key, value) => {
  console.log(`Getting thinking message for key: ${key}, value: ${value}`);
  const variants = (thinkingVariants[key] || thinkingVariants.default)(value);
  if (!variants.length) return '';

  if (!usedThinkingIndices.has(key)) {
    usedThinkingIndices.set(key, new Set());
  }

  const used = usedThinkingIndices.get(key);

  if (used.size === variants.length) {
    used.clear();
  }

  let index;
  do {
    index = Math.floor(Math.random() * variants.length);
  } while (used.has(index));

  used.add(index);
  console.log(`Selected message: ${variants[index]}`);
  return variants[index];
};

export const resetThinkingMessages = () => {
  usedThinkingIndices.clear();
};