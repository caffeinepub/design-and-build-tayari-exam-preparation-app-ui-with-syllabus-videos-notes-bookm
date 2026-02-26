# Specification

## Summary
**Goal:** Fix the TAYARI logo's visible checkered/white background and reduce the signature size while removing its black box on the SplashScreen.

**Planned changes:**
- Apply `mix-blend-mode: multiply` (or equivalent CSS technique) to the TAYARI logo image on SplashScreen so the white/checkered background blends seamlessly with the teal gradient background.
- Make the signature image (जनक प्रसाद पाण्डे) noticeably smaller on the SplashScreen.
- Apply `mix-blend-mode: multiply` or `screen` to the signature image to remove the visible black rectangular background box, making it blend with the teal gradient.

**User-visible outcome:** On the SplashScreen, the TAYARI logo appears to float directly on the teal gradient with no white or checkered box, and the signature is smaller and displays without a black background rectangle.
