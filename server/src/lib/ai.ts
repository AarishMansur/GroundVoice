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

export async function analyzeSubmission(reportContent: string): Promise<string> {
    return query({
        messages: [
            {
                role: "system",
                content: "You are a humanitarian data analyst. Convert the following informal health observation into a formal UN Situation Report (SITREP) format, including sections like 'Executive Summary', 'Affected Population', and 'Recommended Actions'."
            },
            {
                role: "user",
                content: reportContent
            }
        ],
        model: "meta-llama/Llama-3.1-8B-Instruct:novita",
    }).then((response) => {
        return response.choices[0].message.content;
    }).catch((error) => {
        console.error("AI_ANALYSIS_FAILURE:", error);
        throw new Error("We encountered an issue while analyzing the report. Please try again.");
    });
}