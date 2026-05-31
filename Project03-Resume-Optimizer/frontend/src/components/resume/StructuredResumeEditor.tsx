import { useState } from "react";
import { Button } from "@carbon/react";
import { Add, TrashCan, ChevronDown, ChevronRight } from "@carbon/icons-react";
import type { StructuredResume, ContactInfo, ExperienceEntry, EducationEntry } from "../../types/resume";

interface Props {
  data: StructuredResume;
  loading: boolean;
  onRefresh: () => void;
}

function emptyExperience(): ExperienceEntry {
  return { company: "", title: "", start_date: "", end_date: "", description: "" };
}

function emptyEducation(): EducationEntry {
  return { institution: "", degree: "", field: "", start_date: "", end_date: "" };
}

const card = {
  border: "1px solid #e0e0e0",
  padding: 32,
  backgroundColor: "#ffffff",
  borderRadius: 4,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const sectionHeader = {
  fontSize: 16,
  fontWeight: 600,
  margin: "0 0 20px",
  letterSpacing: "0.16px",
  color: "#161616",
};

const label = {
  fontSize: 12,
  fontWeight: 600,
  color: "#525252",
  letterSpacing: "0.32px",
  marginBottom: 4,
  textTransform: "uppercase" as const,
};

const input = {
  width: "100%",
  padding: "8px 12px",
  fontSize: 14,
  border: "1px solid #e0e0e0",
  borderRadius: 4,
  backgroundColor: "#ffffff",
  color: "#161616",
  outline: "none",
  boxSizing: "border-box" as const,
};

const textareaStyle = {
  ...input,
  resize: "vertical" as const,
  minHeight: 80,
  fontFamily: "inherit",
};

export default function StructuredResumeEditor({ data, loading, onRefresh }: Props) {
  const [form, setForm] = useState<StructuredResume>(() => JSON.parse(JSON.stringify(data)));
  const [collapsed, setCollapsed] = useState(false);

  const updateContact = (field: keyof ContactInfo, value: string) => {
    setForm({ ...form, contact: { ...form.contact, [field]: value } });
  };

  const updateSummary = (value: string) => {
    setForm({ ...form, summary: value });
  };

  const addSkill = () => {
    const skill = prompt("Enter a skill:");
    if (skill && skill.trim()) {
      setForm({ ...form, skills: [...form.skills, skill.trim()] });
    }
  };

  const removeSkill = (i: number) => {
    setForm({ ...form, skills: form.skills.filter((_, idx) => idx !== i) });
  };

  const updateSkill = (i: number, value: string) => {
    const skills = [...form.skills];
    skills[i] = value;
    setForm({ ...form, skills });
  };

  const addExperience = () => {
    setForm({ ...form, experience: [...form.experience, emptyExperience()] });
  };

  const updateExperience = (i: number, field: keyof ExperienceEntry, value: string) => {
    const experience = form.experience.map((e, idx) =>
      idx === i ? { ...e, [field]: value } : e,
    );
    setForm({ ...form, experience });
  };

  const removeExperience = (i: number) => {
    setForm({ ...form, experience: form.experience.filter((_, idx) => idx !== i) });
  };

  const addEducation = () => {
    setForm({ ...form, education: [...form.education, emptyEducation()] });
  };

  const updateEducation = (i: number, field: keyof EducationEntry, value: string) => {
    const education = form.education.map((e, idx) =>
      idx === i ? { ...e, [field]: value } : e,
    );
    setForm({ ...form, education });
  };

  const removeEducation = (i: number) => {
    setForm({ ...form, education: form.education.filter((_, idx) => idx !== i) });
  };

  return (
    <div style={{ ...card, marginBottom: 32 }}>
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer", userSelect: "none",
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {collapsed ? <ChevronRight size={20} style={{ color: "#0f62fe" }} /> : <ChevronDown size={20} style={{ color: "#0f62fe" }} />}
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, letterSpacing: "0.16px" }}>
            Extracted resume data
          </h3>
          <span style={{ fontSize: 12, color: "#8c8c8c", letterSpacing: "0.16px" }}>
            — edit fields as needed
          </span>
        </div>
        <Button kind="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onRefresh(); }} disabled={loading}>
          {loading ? "Extracting..." : "Re-extract"}
        </Button>
      </div>

      {!collapsed && (
        <div style={{ marginTop: 24 }}>

          {/* ── Contact Info ── */}
          <div style={{ marginBottom: 28 }}>
            <p style={sectionHeader}>Contact</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {(["name", "email", "phone", "location", "linkedin", "github"] as const).map((field) => (
                <div key={field}>
                  <label style={label}>{field === "linkedin" ? "LinkedIn" : field === "github" ? "GitHub" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    style={input}
                    value={form.contact[field]}
                    onChange={(e) => updateContact(field, e.target.value)}
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Summary ── */}
          <div style={{ marginBottom: 28 }}>
            <p style={sectionHeader}>Professional Summary</p>
            <textarea
              style={textareaStyle}
              value={form.summary}
              onChange={(e) => updateSummary(e.target.value)}
              placeholder="Professional summary..."
            />
          </div>

          {/* ── Skills ── */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <p style={sectionHeader}>Skills</p>
              <Button kind="ghost" size="sm" renderIcon={Add} onClick={addSkill}>Add</Button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {form.skills.map((skill, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "4px 8px 4px 12px",
                    backgroundColor: "#f4f4f4", borderRadius: 4,
                    fontSize: 13, color: "#161616", letterSpacing: "0.16px",
                  }}
                >
                  <input
                    style={{
                      border: "none", background: "transparent", fontSize: 13,
                      color: "#161616", outline: "none", width: "auto", minWidth: 60,
                    }}
                    value={skill}
                    onChange={(e) => updateSkill(i, e.target.value)}
                  />
                  <button
                    onClick={() => removeSkill(i)}
                    style={{
                      border: "none", background: "none", cursor: "pointer",
                      padding: 0, display: "flex", color: "#8c8c8c", fontSize: 14,
                    }}
                    title="Remove skill"
                  >
                    ×
                  </button>
                </div>
              ))}
              {form.skills.length === 0 && (
                <span style={{ fontSize: 13, color: "#8c8c8c", letterSpacing: "0.16px" }}>
                  No skills extracted. Click "Add" to add one.
                </span>
              )}
            </div>
          </div>

          {/* ── Experience ── */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <p style={sectionHeader}>Experience</p>
              <Button kind="ghost" size="sm" renderIcon={Add} onClick={addExperience}>Add</Button>
            </div>
            {form.experience.map((exp, i) => (
              <div
                key={i}
                style={{
                  padding: 16, marginBottom: 12, backgroundColor: "#f8f8f8", borderRadius: 4,
                  border: "1px solid #e8e8e8", position: "relative",
                }}
              >
                <button
                  onClick={() => removeExperience(i)}
                  style={{
                    position: "absolute", top: 12, right: 12,
                    border: "none", background: "none", cursor: "pointer", color: "#da1e28",
                    padding: 4, display: "flex",
                  }}
                  title="Remove experience"
                >
                  <TrashCan size={16} />
                </button>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  {(["company", "title"] as const).map((field) => (
                    <div key={field}>
                      <label style={label}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                      <input
                        style={input}
                        value={exp[field]}
                        onChange={(e) => updateExperience(i, field, e.target.value)}
                        placeholder={`Enter ${field}`}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={label}>Start date</label>
                    <input
                      style={input}
                      value={exp.start_date}
                      onChange={(e) => updateExperience(i, "start_date", e.target.value)}
                      placeholder="e.g. Jan 2020"
                    />
                  </div>
                  <div>
                    <label style={label}>End date</label>
                    <input
                      style={input}
                      value={exp.end_date}
                      onChange={(e) => updateExperience(i, "end_date", e.target.value)}
                      placeholder="e.g. Present"
                    />
                  </div>
                </div>
                <div>
                  <label style={label}>Description</label>
                  <textarea
                    style={textareaStyle}
                    value={exp.description}
                    onChange={(e) => updateExperience(i, "description", e.target.value)}
                    placeholder="Describe responsibilities and achievements..."
                  />
                </div>
              </div>
            ))}
            {form.experience.length === 0 && (
              <span style={{ fontSize: 13, color: "#8c8c8c", letterSpacing: "0.16px" }}>
                No experience entries extracted. Click "Add" to add one.
              </span>
            )}
          </div>

          {/* ── Education ── */}
          <div style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <p style={sectionHeader}>Education</p>
              <Button kind="ghost" size="sm" renderIcon={Add} onClick={addEducation}>Add</Button>
            </div>
            {form.education.map((edu, i) => (
              <div
                key={i}
                style={{
                  padding: 16, marginBottom: 12, backgroundColor: "#f8f8f8", borderRadius: 4,
                  border: "1px solid #e8e8e8", position: "relative",
                }}
              >
                <button
                  onClick={() => removeEducation(i)}
                  style={{
                    position: "absolute", top: 12, right: 12,
                    border: "none", background: "none", cursor: "pointer", color: "#da1e28",
                    padding: 4, display: "flex",
                  }}
                  title="Remove education"
                >
                  <TrashCan size={16} />
                </button>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  {(["institution", "degree", "field"] as const).map((field) => (
                    <div key={field}>
                      <label style={label}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                      <input
                        style={input}
                        value={edu[field]}
                        onChange={(e) => updateEducation(i, field, e.target.value)}
                        placeholder={`Enter ${field}`}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={label}>Start date</label>
                    <input
                      style={input}
                      value={edu.start_date}
                      onChange={(e) => updateEducation(i, "start_date", e.target.value)}
                      placeholder="e.g. Sep 2016"
                    />
                  </div>
                  <div>
                    <label style={label}>End date</label>
                    <input
                      style={input}
                      value={edu.end_date}
                      onChange={(e) => updateEducation(i, "end_date", e.target.value)}
                      placeholder="e.g. Jun 2020"
                    />
                  </div>
                </div>
              </div>
            ))}
            {form.education.length === 0 && (
              <span style={{ fontSize: 13, color: "#8c8c8c", letterSpacing: "0.16px" }}>
                No education entries extracted. Click "Add" to add one.
              </span>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
