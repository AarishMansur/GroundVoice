async function query(data: { model: string, messages: { role: string; content: string }[] }) {
    const response = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
            headers: {
                Authorization: `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();
    return result;
}

export async function analyzeSubmission(reportContent: string): Promise<{ sitrep: string; severity: number }> {
    return query({
        messages: [
            {
                role: "system",
                content: "You are a humanitarian data analyst. Convert the following informal health observation into a formal UN Situation Report (SITREP) format and assign a severity score between 1 and 10 (where 10 is most critical). Return the result as a JSON object with keys 'sitrep' (markdown string) and 'severity' (integer)."
            },
            {
                role: "user",
                content: reportContent
            }
        ],
        model: "meta-llama/Llama-3.1-8B-Instruct:novita",
    }).then((response) => {
        const content = response.choices[0].message.content;
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
            return {
                sitrep: parsed.sitrep || content,
                severity: typeof parsed.severity === 'number' ? parsed.severity : 5
            };
        } catch (e) {
            return { sitrep: content, severity: 5 };
        }
    }).catch((error) => {
        console.error("AI_ANALYSIS_FAILURE:", error);
        throw new Error("We encountered an issue while analyzing the report. Please try again.");
    });
}