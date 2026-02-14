
import { GoogleGenAI, Type } from "@google/genai";
import { Connect, Organization, Stakeholder, Status, IndustryInsightsData, Activity, Lead } from '../types';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});

export const getConnectSummary = async (
    connect: Connect,
    startup: Organization,
    corporate: Organization,
    owner: Stakeholder,
    status: Status,
    activities: Activity[],
    stakeholdersById: Record<string, Stakeholder>
): Promise<string> => {
    
    const activityLog = activities
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(act => {
            const participants = act.participants.map(pId => stakeholdersById[pId]?.name).filter(Boolean).join(', ');
            return `- ${new Date(act.date).toLocaleDateString()}: ${act.type} - "${act.title}" with ${participants}. Notes: ${act.notes || 'N/A'}`;
        }).join('\n');

    const prompt = `
        You are a venture capital analyst. Analyze the following deal timeline and provide a concise summary and suggest potential next steps.

        Deal Information:
        - Title: ${connect.title}
        - Current Status: ${status.name}
        - Record Owner: ${owner.name}
        - Startup: ${startup.name}
        - Corporate Partner: ${corporate.name}

        Activity History (Chronological):
        ${activityLog || 'No activities logged yet.'}

        Based on the full deal context and its history:
        1.  **Summary:** Provide a brief, professional summary of the deal's progression and current state.
        2.  **Next Steps:** Suggest 2-3 actionable next steps to move this deal forward, considering its most recent activity and overall status.

        Format the output in Markdown. Use headings for "Summary" and "Next Steps".
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.5,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating summary with Gemini API:", error);
        if (error instanceof Error) {
            return `An error occurred while generating the summary: ${error.message}`;
        }
        return "An unknown error occurred while generating the summary.";
    }
};

export const getIndustryInsights = async (organizationName: string): Promise<IndustryInsightsData> => {
    const prompt = `
        You are a business analyst for a venture capital firm.
        Provide a detailed market analysis and identify the key competitors for the company named "${organizationName}".

        Your analysis should cover:
        1.  **Market Overview:** A brief summary of the industry and market segment ${organizationName} operates in.
        2.  **Key Competitors:** A list of 3-5 primary competitors. For each competitor, provide a short (1-2 sentence) description of what they do and why they are a competitor.
        3.  **Competitive Advantage:** Briefly suggest what might be ${organizationName}'s key differentiator or competitive advantage based on public information.

        Format the entire output in Markdown.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0.3,
            }
        });

        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
            ?.map(chunk => chunk.web)
            .filter((web): web is { uri: string; title: string } => !!web?.uri) || [];

        return {
            analysis: response.text,
            sources: sources
        };
    } catch (error) {
        console.error("Error generating industry insights with Gemini API:", error);
        let errorMessage = "An unknown error occurred while generating the insights.";
        if (error instanceof Error) {
            errorMessage = `An error occurred while generating the insights: ${error.message}`;
        }
        return {
            analysis: errorMessage,
            sources: []
        };
    }
};
