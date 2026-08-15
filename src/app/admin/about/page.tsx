"use client";

import React, { useState, useEffect } from "react";
import { User, Sparkles, Trophy, Briefcase, Plus, Save, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { LanguageField } from "@/components/admin/LanguageField";
import { Modal } from "@/components/ui/Modal";
import { FileUploader } from "@/components/ui/FileUploader";
import { useToast } from "@/components/ui/Toast";

export default function AdminAboutPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<"profile" | "skills" | "experience" | "awards">("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<any>({
    authorName: "",
    headlineUz: "",
    headlineRu: "",
    headlineEn: "",
    bioUz: "",
    bioRu: "",
    bioEn: "",
    longBioUz: "",
    longBioRu: "",
    longBioEn: "",
    profilePhoto: "",
    coverImage: "",
    location: "",
    email: "",
    phone: "",
    telegram: "",
    availabilityUz: "",
    yearsOfExperience: 6,
    clientCount: 50,
    projectCount: 120,
    awardCount: 7,
  });

  // Skills State
  const [skills, setSkills] = useState<any[]>([]);
  const [isSkillModal, setIsSkillModal] = useState(false);
  const [skillForm, setSkillForm] = useState({ id: "", name: "", percentage: 90, category: "3D & Visual" });

  // Experience State
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isExpModal, setIsExpModal] = useState(false);
  const [expForm, setExpForm] = useState({ id: "", company: "", roleUz: "", startYear: "2023", endYear: "Hozirgi vaqt", descUz: "" });

  // Awards State
  const [awards, setAwards] = useState<any[]>([]);
  const [isAwardModal, setIsAwardModal] = useState(false);
  const [awardForm, setAwardForm] = useState({ id: "", titleUz: "", issuer: "", year: "2025" });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/about");
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
      if (data.skills) setSkills(data.skills);
      if (data.experiences) setExperiences(data.experiences);
      if (data.awards) setAwards(data.awards);
    } catch {
      toast.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/about", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Saqlashda xatolik");
      toast.success("Profil ma'lumotlari muvaffaqiyatli saqlandi!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Skill CRUD
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = skillForm.id ? `/api/skills/${skillForm.id}` : "/api/skills";
      const method = skillForm.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillForm),
      });
      if (!res.ok) throw new Error("Xatolik");
      toast.success(skillForm.id ? "Ko'nikma yangilandi!" : "Yangi ko'nikma qo'shildi!");
      setIsSkillModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await fetch(`/api/skills/${id}`, { method: "DELETE" });
      toast.success("Ko'nikma o'chirildi");
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Experience CRUD
  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = expForm.id ? `/api/experiences/${expForm.id}` : "/api/experiences";
      const method = expForm.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expForm),
      });
      if (!res.ok) throw new Error("Xatolik");
      toast.success(expForm.id ? "Tajriba yangilandi!" : "Yangi tajriba qo'shildi!");
      setIsExpModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteExp = async (id: string) => {
    try {
      await fetch(`/api/experiences/${id}`, { method: "DELETE" });
      toast.success("Tajriba o'chirildi");
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Awards CRUD
  const handleSaveAward = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = awardForm.id ? `/api/awards/${awardForm.id}` : "/api/awards";
      const method = awardForm.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(awardForm),
      });
      if (!res.ok) throw new Error("Xatolik");
      toast.success(awardForm.id ? "Mukofot yangilandi!" : "Yangi mukofot qo'shildi!");
      setIsAwardModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteAward = async (id: string) => {
    try {
      await fetch(`/api/awards/${id}`, { method: "DELETE" });
      toast.success("Mukofot o'chirildi");
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#F5F7F2]">
            About & Identity CMS
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Muallif shaxsiy ma'lumotlari, ko'nikmalar foizlari, faoliyat va yutuqlarni boshqarish
          </p>
        </div>

        {activeTab === "profile" && (
          <Button onClick={handleSaveProfile} variant="primary" isLoading={isSaving}>
            <Save className="w-4 h-4" />
            <span>O'zgarishlarni saqlash</span>
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 w-fit">
        {[
          { id: "profile", label: "Shaxsiy Profil & Bio", icon: User },
          { id: "skills", label: "Ko'nikmalar (%)", icon: Sparkles },
          { id: "experience", label: "Ish Tajribasi", icon: Briefcase },
          { id: "awards", label: "Mukofotlar", icon: Trophy },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === tab.id
                  ? "bg-[#A3E635] text-[#050607] font-bold shadow-md"
                  : "text-[#9CA3AF] hover:text-[#F5F7F2]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile & Bio */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-8">
          <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-6">
            <h3 className="text-base font-bold font-display text-[#F5F7F2]">
              1. Asosiy shaxsiy ma'lumotlar
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Muallif To'liq Ismi"
                value={settings.authorName}
                onChange={(e) => setSettings({ ...settings, authorName: e.target.value })}
              />
              <Input
                label="Manzil (Location)"
                value={settings.location}
                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
              />
              <Input
                label="Email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
              <Input
                label="Telegram"
                value={settings.telegram}
                onChange={(e) => setSettings({ ...settings, telegram: e.target.value })}
              />
            </div>
          </div>

          <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-6">
            <h3 className="text-base font-bold font-display text-[#F5F7F2]">
              2. Sarlavha va Biografiya matnlari
            </h3>

            <LanguageField
              label="Asosiy Shior / Headline"
              values={{ uz: settings.headlineUz, ru: settings.headlineRu, en: settings.headlineEn }}
              onChange={(lang, val) => {
                if (lang === "uz") setSettings({ ...settings, headlineUz: val });
                if (lang === "ru") setSettings({ ...settings, headlineRu: val });
                if (lang === "en") setSettings({ ...settings, headlineEn: val });
              }}
            />

            <LanguageField
              label="Qisqa Bio (Hero Subtext)"
              isTextarea
              rows={3}
              values={{ uz: settings.bioUz, ru: settings.bioRu, en: settings.bioEn }}
              onChange={(lang, val) => {
                if (lang === "uz") setSettings({ ...settings, bioUz: val });
                if (lang === "ru") setSettings({ ...settings, bioRu: val });
                if (lang === "en") setSettings({ ...settings, bioEn: val });
              }}
            />

            <LanguageField
              label="Kengaytirilgan Biografiya (About Page)"
              isTextarea
              rows={5}
              values={{ uz: settings.longBioUz || "", ru: settings.longBioRu || "", en: settings.longBioEn || "" }}
              onChange={(lang, val) => {
                if (lang === "uz") setSettings({ ...settings, longBioUz: val });
                if (lang === "ru") setSettings({ ...settings, longBioRu: val });
                if (lang === "en") setSettings({ ...settings, longBioEn: val });
              }}
            />
          </div>
        </form>
      )}

      {/* Tab 2: Skills (%) */}
      {activeTab === "skills" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                setSkillForm({ id: "", name: "", percentage: 90, category: "3D & Visual" });
                setIsSkillModal(true);
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Yangi ko'nikma qo'shish</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 rounded-2xl glass-panel border border-white/10 bg-[#080A0B]/80 flex items-center justify-between"
              >
                <div className="flex-1 pr-4">
                  <div className="flex justify-between text-xs font-bold text-[#F5F7F2] mb-1">
                    <span>{skill.name}</span>
                    <span className="font-mono text-[#A3E635]">{skill.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#A3E635] h-full" style={{ width: `${skill.percentage}%` }} />
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-[#A3E635]"
                    onClick={() => {
                      setSkillForm(skill);
                      setIsSkillModal(true);
                    }}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-rose-400"
                    onClick={() => handleDeleteSkill(skill.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Experience */}
      {activeTab === "experience" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                setExpForm({ id: "", company: "", roleUz: "", startYear: "2023", endYear: "Hozirgi vaqt", descUz: "" });
                setIsExpModal(true);
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Yangi tajriba qo'shish</span>
            </Button>
          </div>

          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="p-6 rounded-2xl glass-panel border border-white/10 bg-[#080A0B]/80 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-[#F5F7F2]">{exp.roleUz}</h4>
                  <p className="text-xs text-[#A3E635] font-semibold">{exp.company}</p>
                  <p className="text-[11px] text-[#6B7280] font-mono mt-1">
                    {exp.startYear} — {exp.endYear || "Hozirgi vaqt"}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-[#A3E635]"
                    onClick={() => {
                      setExpForm(exp);
                      setIsExpModal(true);
                    }}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-rose-400"
                    onClick={() => handleDeleteExp(exp.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Awards */}
      {activeTab === "awards" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                setAwardForm({ id: "", titleUz: "", issuer: "", year: "2025" });
                setIsAwardModal(true);
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Yangi mukofot qo'shish</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {awards.map((award) => (
              <div
                key={award.id}
                className="p-4 rounded-2xl glass-panel border border-white/10 bg-[#080A0B]/80 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#F5F7F2]">{award.titleUz}</h4>
                  <p className="text-[11px] text-[#A3E635]">{award.issuer} • {award.year}</p>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-[#A3E635]"
                    onClick={() => {
                      setAwardForm(award);
                      setIsAwardModal(true);
                    }}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-rose-400"
                    onClick={() => handleDeleteAward(award.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Modal */}
      <Modal isOpen={isSkillModal} onClose={() => setIsSkillModal(false)} title="Ko'nikma (Skill)">
        <form onSubmit={handleSaveSkill} className="space-y-4">
          <Input
            label="Ko'nikma Nomi *"
            placeholder="Cinema 4D & Octane"
            required
            value={skillForm.name}
            onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
          />
          <div>
            <label className="block text-xs font-semibold text-[#9CA3AF] uppercase mb-1">
              Egallash darajasi ({skillForm.percentage}%)
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={skillForm.percentage}
              onChange={(e) => setSkillForm({ ...skillForm, percentage: Number(e.target.value) })}
              className="w-full accent-[#A3E635]"
            />
          </div>
          <Input
            label="Kategoriya"
            placeholder="3D & Visual"
            value={skillForm.category}
            onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setIsSkillModal(false)}>Bekor qilish</Button>
            <Button variant="primary" type="submit">Saqlash</Button>
          </div>
        </form>
      </Modal>

      {/* Experience Modal */}
      <Modal isOpen={isExpModal} onClose={() => setIsExpModal(false)} title="Ish Tajribasi">
        <form onSubmit={handleSaveExp} className="space-y-4">
          <Input
            label="Kompaniya Nomi *"
            placeholder="NeoStudio Global"
            required
            value={expForm.company}
            onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
          />
          <Input
            label="Lavozim (Role) *"
            placeholder="Lead 3D & Brand Designer"
            required
            value={expForm.roleUz}
            onChange={(e) => setExpForm({ ...expForm, roleUz: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Boshlangan yil"
              placeholder="2023"
              value={expForm.startYear}
              onChange={(e) => setExpForm({ ...expForm, startYear: e.target.value })}
            />
            <Input
              label="Tugagan yil"
              placeholder="Hozirgi vaqt"
              value={expForm.endYear}
              onChange={(e) => setExpForm({ ...expForm, endYear: e.target.value })}
            />
          </div>
          <Textarea
            label="Faoliyat tavsifi"
            rows={3}
            placeholder="Loyiha va jamoaga rahbarlik..."
            value={expForm.descUz}
            onChange={(e) => setExpForm({ ...expForm, descUz: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setIsExpModal(false)}>Bekor qilish</Button>
            <Button variant="primary" type="submit">Saqlash</Button>
          </div>
        </form>
      </Modal>

      {/* Award Modal */}
      <Modal isOpen={isAwardModal} onClose={() => setIsAwardModal(false)} title="Mukofot (Award)">
        <form onSubmit={handleSaveAward} className="space-y-4">
          <Input
            label="Mukofot Nomi *"
            placeholder="Awwwards Site of the Day"
            required
            value={awardForm.titleUz}
            onChange={(e) => setAwardForm({ ...awardForm, titleUz: e.target.value })}
          />
          <Input
            label="Taqdim etuvchi (Issuer) *"
            placeholder="Awwwards"
            required
            value={awardForm.issuer}
            onChange={(e) => setAwardForm({ ...awardForm, issuer: e.target.value })}
          />
          <Input
            label="Yil"
            placeholder="2025"
            value={awardForm.year}
            onChange={(e) => setAwardForm({ ...awardForm, year: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setIsAwardModal(false)}>Bekor qilish</Button>
            <Button variant="primary" type="submit">Saqlash</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
