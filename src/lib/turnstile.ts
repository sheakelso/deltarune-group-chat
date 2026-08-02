export async function verifyTurnstileToken(token: string): Promise<boolean> {
    let response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: JSON.stringify({
            secret: "0x4AAAAAAECZvqgF2D7wcrCeqcK29algTUY",
            response: token
        }),
        headers: {
            "Content-Type": "application/json",
        }
    });

    let result = await response.json();

    return result.success == true;
}
