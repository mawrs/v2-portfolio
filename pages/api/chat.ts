import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY

const knowledgeBase = {
  about: "Martin Tejeda is a product designer and experienced founder, combining creative vision with entrepreneurial acumen. He is currently the Head of Design at MDSV Capital and resides in San Francisco, California.",
  skills: ["UX and product design", "User research", "Interaction design", "Design thinking", "Lean methodology"],
  approach: "Martin employs a data-driven, empathetic approach to design, immersing himself in the user's world to uncover pain points and motivations.",
  projects: [
    {
      title: "Facebook Project",
      role: "Product Designer",
      outcome: "Increased engagement between public figures and audiences by 15%, and saw a 25% increase in comments and reactions from designated top fans"
    },
    {
      title: "Square Project",
      role: "Product Designer",
      outcome: "Achieved a 12.5% decrease in reported phishing attempts, 70% reduction in financial losses due to email scams, and 90% increase in seller confidence in identifying legitimate Square emails"
    },
    {
      title: "Slide Project",
      role: "Lead Designer",
      outcome: "Achieved 89% onboarding completion rate, reduced average onboarding time from 20 to 8 minutes, increased NPS from 32 to 58, and decreased customer support calls by 45%"
    }
  ],
  techStack: {
    userResearch: ["Maze", "Hotjar", "User Interviews", "Usertesting", "Dovetail"],
    design: ["Figma", "Adobe Illustrator"],
    prototyping: ["Figma", "Protopie"],
    frontEnd: ["HTML5", "EJS", "Bootstrap", "Tailwind", "Javascript"]
  }
}

const checkKnowledgeBase = (input: string) => {
  const lowercaseInput = input.toLowerCase();
  
  // Check for specific project queries
  for (const project of knowledgeBase.projects) {
    if (lowercaseInput.includes(project.title.toLowerCase())) {
      return `Martin's ${project.title} was about enhancing user connections. As a ${project.role}, he worked on this project and achieved the following outcome: ${project.outcome}`;
    }
  }

  // More general project query
  if (lowercaseInput.includes("project") || lowercaseInput.includes("work")) {
    const projectNames = knowledgeBase.projects.map(p => p.title).join(", ");
    return `Martin has worked on several projects including ${projectNames}. Which specific project would you like to know more about?`;
  }

  // Existing checks
  if (lowercaseInput.includes("about") || lowercaseInput.includes("background")) {
    return knowledgeBase.about;
  } else if (lowercaseInput.includes("skills") || lowercaseInput.includes("expertise")) {
    return `Martin's key skills include: ${knowledgeBase.skills.join(", ")}.`;
  } else if (lowercaseInput.includes("approach") || lowercaseInput.includes("methodology")) {
    return knowledgeBase.approach;
  } else if (lowercaseInput.includes("tools") || lowercaseInput.includes("tech stack")) {
    return `For user research, Martin uses: ${knowledgeBase.techStack.userResearch.join(", ")}. For design: ${knowledgeBase.techStack.design.join(", ")}. For prototyping: ${knowledgeBase.techStack.prototyping.join(", ")}. For front-end development: ${knowledgeBase.techStack.frontEnd.join(", ")}.`;
  }

  // If no specific match is found, return null to fallback to Perplexity API
  return null;
}

const systemMessage = `You are an AI assistant for Martin Tejeda, a product designer. 
Respond based on his portfolio and general knowledge. Here's some key information about Martin:

${knowledgeBase.about}

His key skills include: ${knowledgeBase.skills.join(", ")}.

His approach: ${knowledgeBase.approach}

He has worked on projects for ${knowledgeBase.projects.map(p => p.title).join(", ")}.

Please use this information to inform your responses, but feel free to elaborate or provide general design insights when appropriate.`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { query } = req.body

  // First, check if we can answer from the knowledge base
  const knowledgeBaseResponse = checkKnowledgeBase(query);
  if (knowledgeBaseResponse) {
    return res.status(200).json({ response: knowledgeBaseResponse });
  }

  // If not in knowledge base, use Perplexity API
  try {
    const response = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: query }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    res.status(200).json({ response: response.data.choices[0].message.content })
  } catch (error) {
    console.error('Error querying Perplexity API:', error)
    res.status(500).json({ message: 'Error querying AI' })
  }
}