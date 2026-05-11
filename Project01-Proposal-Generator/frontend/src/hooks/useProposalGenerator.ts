'use client';

import { useState, useCallback } from 'react';
import type { GenerationRequest, ProposalSection, PricingSection } from '@/types';
import { generateDefaultSections, generateDefaultPricing } from '@/lib/ai/proposal-generator';
import { AI_MODELS } from '@/lib/ai/models';
import { loadActiveModel } from '@/lib/ai/model-loader';

export interface GenerationState {
  isGenerating: boolean;
  progress: number;
  currentStep: string;
  error: string | null;
  logs: LogEntry[];
}

interface LogEntry {
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai';
}

export interface GeneratedContent {
  type: ProposalSection['type'];
  title: string;
  content: string;
}

function extractContentField(text: string): string | null {
  const pattern = /"content"\s*:\s*"/g;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const start = match.index + match[0].length;
    const endQuote = findEndQuote(text, start);
    if (endQuote === -1) continue;
    const raw = text.substring(start, endQuote);
    try {
      return unescapeJsonString(raw);
    } catch {
      return raw;
    }
  }
  return null;
}

function findEndQuote(str: string, start: number): number {
  for (let i = start; i < str.length; i++) {
    if (str[i] === '"' && str[i - 1] !== '\\') return i;
  }
  return -1;
}

function unescapeJsonString(str: string): string {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

function extractJsonContent(text: string): string | null {
  const content = extractContentField(text);
  if (content) return content;

  const jsonStart = text.indexOf('{');
  if (jsonStart === -1) return null;

  let depth = 0;
  let jsonEnd = -1;
  for (let i = jsonStart; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"' && text[i - 1] !== '\\') {
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        jsonEnd = i + 1;
        break;
      }
    }
  }

  if (jsonEnd === -1) return null;

  try {
    const parsed = JSON.parse(text.substring(jsonStart, jsonEnd));
    if (parsed.content && typeof parsed.content === 'string') {
      return parsed.content;
    }
  } catch {
  }
  return null;
}

function cleanModelOutput(text: string): { content: string; fromJson: boolean } {
  const content = extractJsonContent(text);
  if (content) return { content, fromJson: true };

  return { content: text.trim(), fromJson: false };
}





export function useProposalGenerator() {
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    progress: 0,
    currentStep: '',
    error: null,
    logs: [],
  });

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setState((prev) => ({
      ...prev,
      logs: [...prev.logs, { timestamp: new Date(), message, type }],
    }));
  }, []);

  const clearLogs = useCallback(() => {
    setState((prev) => ({ ...prev, logs: [] }));
  }, []);

  const generateForReview = useCallback(async (request: GenerationRequest, modelId?: string): Promise<{
    sections: GeneratedContent[];
    pricing: PricingSection;
  }> => {
    clearLogs();
    setState({
      isGenerating: true,
      progress: 0,
      currentStep: 'Initializing AI model...',
      error: null,
      logs: [],
    });

    addLog('═══════════════════════════════════════════════════════════', 'info');
    addLog('🚀 STARTING PROPOSAL GENERATION', 'info');
    addLog('═══════════════════════════════════════════════════════════', 'info');
    addLog(`📝 Prompt: "${request.prompt.substring(0, 150)}${request.prompt.length > 150 ? '...' : ''}"`, 'info');
    addLog(`📂 Project Type: ${request.projectType}`, 'info');
    addLog(`👤 Client: ${request.clientName || 'Not specified'}`, 'info');
    addLog(`🤖 Model ID: ${modelId || 'Using default'}`, 'info');

    const effectiveModelId = modelId || 'gemma-4-e4b';
    const modelConfig = AI_MODELS.find(m => m.id === effectiveModelId);
    const modelName = modelConfig?.name || effectiveModelId;
    addLog(`📦 Using model: ${modelName}`, 'info');

    try {
      setState((prev) => ({ ...prev, progress: 5, currentStep: 'Loading AI model...' }));
      addLog(`⏳ Loading ${modelName}...`, 'info');

      const { model, processor } = await loadActiveModel(effectiveModelId);

      addLog(`✅ ${modelName} ready!`, 'success');

      const sectionTypes = [
        { type: 'overview' as const, title: 'Project Overview', promptTemplate: `You are a proposal writer. Generate a Project Overview for this project. Return ONLY valid JSON with no extra text: {"type":"overview","title":"Project Overview","content":"YOUR CONTENT HERE"}. Content must be at least 300 words with **bold** headers. Project: "${request.prompt}". Type: ${request.projectType}.${request.clientName ? ` Client: ${request.clientName}` : ''}.` },
        { type: 'scope' as const, title: 'Scope of Work', promptTemplate: `You are a project manager. Generate a Scope of Work for this project. Return ONLY valid JSON with no extra text: {"type":"scope","title":"Scope of Work","content":"YOUR CONTENT HERE"}. Content must be at least 400 words with **bold** headers and bullet points. Project: "${request.prompt}". Type: ${request.projectType}.` },
        { type: 'approach' as const, title: 'Our Approach', promptTemplate: `You are a methodology consultant. Generate Our Approach for this project. Return ONLY valid JSON with no extra text: {"type":"approach","title":"Our Approach","content":"YOUR CONTENT HERE"}. Content must be at least 400 words with **bold** phase headers. Project: "${request.prompt}". Type: ${request.projectType}.` },
        { type: 'timeline' as const, title: 'Timeline & Milestones', promptTemplate: `You are a project scheduler. Generate a Timeline for this project. Return ONLY valid JSON with no extra text: {"type":"timeline","title":"Timeline & Milestones","content":"YOUR CONTENT HERE"}. Include a markdown table and at least 200 words narrative. Project: "${request.prompt}". Type: ${request.projectType}.` },
        { type: 'deliverables' as const, title: 'Deliverables', promptTemplate: `You are a consultant. Generate a Deliverables section for this project. Return ONLY valid JSON with no extra text: {"type":"deliverables","title":"Deliverables","content":"YOUR CONTENT HERE"}. Content must be at least 350 words with **bold** headers. Project: "${request.prompt}". Type: ${request.projectType}.` },
        { type: 'terms' as const, title: 'Terms & Conditions', promptTemplate: `You are a legal expert. Generate Terms & Conditions for this project. Return ONLY valid JSON with no extra text: {"type":"terms","title":"Terms & Conditions","content":"YOUR CONTENT HERE"}. Content must be at least 400 words covering payment, revisions, IP, confidentiality. Project: "${request.prompt}". Type: ${request.projectType}.` },
      ];

      addLog(`📋 Generating ${sectionTypes.length} sections...`, 'info');

const sections: { type: ProposalSection['type']; title: string; content: string }[] = [];

      const messages = [
        { role: 'user' as const, content: [{ type: 'text' as const, text: '' }] },
      ];

      for (let i = 0; i < sectionTypes.length; i++) {
        const section = sectionTypes[i];
        setState((prev) => ({ ...prev, progress: 30 + Math.round((i / sectionTypes.length) * 40), currentStep: `Generating ${section.title}...` }));
        addLog(`───────────────────────────────────────────────────────────`, 'info');
        addLog(`[${i + 1}/${sectionTypes.length}] 📄 Generating: ${section.title}`, 'info');

        try {
          const startTime = Date.now();

          messages[0].content[0].text = section.promptTemplate;
          console.log(`[useProposalGenerator] Sending prompt for "${section.title}": ${section.promptTemplate}`);
          const prompt = processor.apply_chat_template(messages, {
            enable_thinking: false,
            add_generation_prompt: true,
          });

          const inputs = await processor(prompt, null, null, { add_special_tokens: false });

          const outputs = await model.generate({
            ...inputs,
            max_new_tokens: 2048,
            do_sample: true,
            temperature: 0.7,
          });

let decoded = processor.decode(outputs[0], { skip_special_tokens: true });
          const thoughtMatch = decoded.match(/<\|channel\|>thought\n[\s\S]*?<\|channel\|>\s*/);
          if (thoughtMatch) decoded = decoded.replace(thoughtMatch[0], '');

          console.log(`[useProposalGenerator] Raw AI output for "${section.title}":\n${decoded}`);

          const result = cleanModelOutput(decoded);
          const elapsedTime = Date.now() - startTime;
          addLog(`📥 Response received in ${elapsedTime}ms (${decoded.length} chars)`, 'success');
          addLog(`🔍 JSON extraction: fromJson=${result.fromJson}, contentLength=${result.content.length}, preview="${result.content.substring(0, 100).replace(/\n/g, '\\n')}"`, 'info');
          let content = result.content;
          console.log(`[useProposalGenerator] Extracted content for "${section.title}" (${content.length} chars):\n${content}`);
          if (result.fromJson) {
            addLog(`✅ Extracted JSON content (${content.length} chars)`, 'success');
          } else if (content.length > 50) {
            addLog(`⚠️ No JSON found, using raw response (${content.length} chars)`, 'warning');
          }

          if (!result.fromJson) {
            addLog(`❌ Failed to parse JSON from model output`, 'error');
            throw new Error(`Failed to extract JSON content for "${section.title}" - model output was not valid JSON`);
          }

          sections.push({
            type: section.type as ProposalSection['type'],
            title: section.title,
            content,
          });
          addLog(`✅ [${i + 1}/${sectionTypes.length}] ${section.title} complete (${content.length} chars)`, 'success');
        } catch (sectionError) {
          addLog(`❌ Error generating ${section.title}: ${sectionError instanceof Error ? sectionError.message : 'Unknown error'}`, 'error');
          throw sectionError;
        }
      }

      addLog('───────────────────────────────────────────────────────────', 'info');
      addLog('✅ All sections generated!', 'success');
      setState((prev) => ({ ...prev, progress: 80, currentStep: 'Generating pricing...' }));
      addLog('💰 Generating pricing section...', 'info');
      const pricing = generateDefaultPricing(request);

      setState((prev) => ({ ...prev, isGenerating: false, progress: 100, currentStep: 'Content ready for review', error: null }));
      addLog(`✨ PROPOSAL GENERATION COMPLETE!`, 'success');
      addLog(`📄 ${sections.length} sections created | 💵 Total: $${pricing.total}`, 'success');

      return { sections, pricing };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addLog(`❌ FATAL ERROR: ${errorMessage}`, 'error');
      setState((prev) => ({ ...prev, isGenerating: false, progress: 0, currentStep: '', error: errorMessage }));
      throw error;
    }
  }, [addLog, clearLogs]);

  const generateProposal = useCallback(async (request: GenerationRequest): Promise<{
    sections: ProposalSection[];
    pricing: PricingSection;
  }> => {
    setState((prev) => ({ ...prev, isGenerating: true, progress: 0, currentStep: 'Starting proposal generation...', error: null }));

    try {
      setState((prev) => ({ ...prev, progress: 40, currentStep: 'Generating sections...' }));
      const defaultSections = generateDefaultSections(request);
      const sections = defaultSections.map((s, i) => ({
        id: s.type + '-' + i,
        type: s.type,
        title: s.title,
        content: s.content,
        order: i,
      }));

      setState((prev) => ({ ...prev, progress: 70, currentStep: 'Generating pricing...' }));
      const pricing = generateDefaultPricing(request);

      setState((prev) => ({ ...prev, progress: 90, currentStep: 'Finalizing proposal...' }));
      const finalSections = sections.map((s, i) => ({ ...s, order: i + 1 }));

      setState((prev) => ({ ...prev, isGenerating: false, progress: 100, currentStep: 'Proposal generated successfully!', error: null }));

      return { sections: finalSections, pricing };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState((prev) => ({ ...prev, isGenerating: false, progress: 0, currentStep: '', error: errorMessage }));
      throw error;
    }
  }, []);

  const resetState = useCallback(() => {
    setState({
      isGenerating: false,
      progress: 0,
      currentStep: '',
      error: null,
      logs: [],
    });
  }, []);

  return {
    ...state,
    generateProposal,
    generateForReview,
    resetState,
    addLog,
    clearLogs,
  };
}