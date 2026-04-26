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

            const reportText = extractReportText(parsed, content);
            const severity = extractSeverity(parsed);

            return { sitrep: reportText, severity };
        } catch (e) {
            let severityMatch = content.match(/"severity"\s*:\s*(\d+)/i);
            let parsedSeverity = 5;
            
            if (severityMatch && severityMatch[1]) {
                parsedSeverity = parseInt(severityMatch[1], 10);
                parsedSeverity = Math.min(10, Math.max(1, parsedSeverity));
            }
            
            return { sitrep: cleanRawContent(content), severity: parsedSeverity };
        }
    }).catch((error) => {
        console.error("AI_ANALYSIS_FAILURE:", error);
        throw new Error("We encountered an issue while analyzing the report. Please try again.");
    });
}

function extractReportText(parsed: Record<string, any>, rawContent: string): string {
    const keys = Object.keys(parsed);
    const reportKeys = ['sitrep', 'report', 'content', 'analysis', 'situation_report', 'summary'];

    for (const candidate of reportKeys) {
        const match = keys.find(k => k.toLowerCase() === candidate);
        if (match && typeof parsed[match] === 'string' && parsed[match].trim()) {
            return parsed[match];
        }
    }

    const longestStringValue = keys
        .filter(k => typeof parsed[k] === 'string' && parsed[k].length > 50)
        .sort((a, b) => parsed[b].length - parsed[a].length)[0];

    if (longestStringValue) {
        return parsed[longestStringValue];
    }

    return cleanRawContent(rawContent);
}

function extractSeverity(parsed: Record<string, any>): number {
    const keys = Object.keys(parsed);
    const severityKeys = ['severity', 'score', 'severity_score', 'level'];

    for (const candidate of severityKeys) {
        const match = keys.find(k => k.toLowerCase() === candidate);
        if (match && typeof parsed[match] === 'number') {
            return Math.min(10, Math.max(1, Math.round(parsed[match])));
        }
    }

    return 5;
}

function cleanRawContent(content: string): string {
    let clean = content
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();


    const sitrepMatch = clean.match(/"sitrep"\s*:\s*"([\s\S]*?)"\s*(?:,\s*"severity"|\})/i);
    if (sitrepMatch && sitrepMatch[1]) {
        return sitrepMatch[1]
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .trim();
    }

    // Aggressive fallback to strip the JSON wrapper manually
    return clean
        .replace(/^[\s\S]*?"sitrep"\s*:\s*"/i, '')
        .replace(/",?\s*"severity"\s*:\s*\d+\s*\}[\s\S]*$/i, '')
        .trim();
}