# **App Name**: ClipNinja

## Core Features:

- Clip Selection: Allow users to input a YouTube URL and specify start and end times for the clip.
- Video Processing: Use ytdl-core to fetch the video and fluent-ffmpeg to trim it to the specified duration.
- Clip Trigger & Loading: Provide a button to trigger the clipping process and display a loading animation while processing.
- Clip Preview & Download: Display a preview of the clipped video and a download button upon successful processing.
- Helpful Tooltips: Show tool-tips for each interactive component for accessibility, and overall ease of use.

## Style Guidelines:

- Use gradient combinations for buttons to create a modern, appealing aesthetic.
- Implement a dark color palette.
- Use purple (#BB86FC) as an accent color for interactive elements.
- Utilize glassmorphism cards for a frosted glass effect, creating depth and visual interest.
- Apply smooth transitions and animations using Framer Motion (or GSAP) for buttons, modals, and loading states.
- Use modern icons (e.g., from FontAwesome or Lucide) for trim, play, and download actions.