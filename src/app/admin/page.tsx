"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Car, Tag, Users, Star, FileText,
  CreditCard, Mail, Truck, ImageIcon, Shield, BarChart3,
  TrendingUp, ChevronRight, Bell, Search, LogOut, Eye,
  Lock, User, X, Plus, Edit2, Trash2, CheckCircle,
  AlertTriangle, ToggleLeft, ToggleRight, Save, ClipboardList,
  ThumbsUp, ThumbsDown, Clock, Phone, RefreshCw, Upload, Settings,
} from "lucide-react";
import { Vehicle, Listing, ContactSubmission, MediaItem } from "@/types";
import type { AdminUser, Role } from "@/lib/users";

// ─── Auth ─────────────────────────────────────────────────────────────────────
const ADMIN_USER = "admin";
const AUTH_KEY = "aeromotors_admin_auth";

// ─── Nav ──────────────────────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "vehicles", label: "Vehicles", icon: Car },
  { id: "listings", label: "Listing Requests", icon: ClipboardList },
  { id: "brands", label: "Brands", icon: Tag },
  { id: "testimonials", label: "Testimonials", icon: Star },
  { id: "finance", label: "Finance Applications", icon: CreditCard },
  { id: "contact", label: "Contact Requests", icon: Mail },
  { id: "sell", label: "Sell Car Requests", icon: Truck },
  { id: "media", label: "Media Library", icon: ImageIcon },
  { id: "users", label: "Users", icon: Users },
  { id: "roles", label: "Roles", icon: Shield },
  { id: "finance-settings", label: "Finance Settings", icon: Settings },
];

// ─── Empty vehicle template ───────────────────────────────────────────────────
const emptyVehicle: Omit<Vehicle, "id" | "createdAt"> = {
  make: "", model: "", year: new Date().getFullYear(), price: 0, mileage: 0,
  transmission: "Automatic", fuelType: "Petrol", bodyStyle: "Sedan",
  color: "", driveType: "FWD", engineSize: "", horsepower: 0,
  images: [""], description: "", features: [],
  isNew: false, isFeatured: false, status: "available", vin: "",
};

const inputCls = "w-full bg-[#2A2A2A] border border-[#404040] text-white placeholder-[#8F8F93] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#8F8F93] transition-colors";
const labelCls = "block text-[#8F8F93] text-xs uppercase tracking-wider mb-1.5 font-medium";

// ─── Vehicle Form Modal ───────────────────────────────────────────────────────
function VehicleModal({
  vehicle,
  onSave,
  onClose,
}: {
  vehicle: Partial<Vehicle> | null;
  onSave: (v: Vehicle) => void;
  onClose: () => void;
}) {
  const isEdit = !!vehicle?.id;
  const [form, setForm] = useState<Omit<Vehicle, "id" | "createdAt">>(
    vehicle?.id
      ? { ...vehicle } as Omit<Vehicle, "id" | "createdAt">
      : { ...emptyVehicle }
  );
  const [featureInput, setFeatureInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.make || !form.model || !form.price) return;
    const saved: Vehicle = {
      ...form,
      id: vehicle?.id || String(Date.now()),
      createdAt: vehicle?.createdAt || new Date().toISOString().split("T")[0],
      images: form.images.filter(Boolean),
    };
    onSave(saved);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      set("features", [...form.features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      const newImages = [...form.images, url];
      set("images", newImages.slice(0, 10));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative bg-[#252525] border border-[#404040] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#404040] sticky top-0 bg-[#252525] z-10">
          <h2 className="font-heading font-bold text-white text-xl">
            {isEdit ? "Edit Vehicle" : "Add New Vehicle"}
          </h2>
          <button onClick={onClose} className="text-[#8F8F93] hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Make / Model / Year */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Make *</label>
              <input className={inputCls} placeholder="Toyota" value={form.make} onChange={(e) => set("make", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Model *</label>
              <input className={inputCls} placeholder="Camry SE" value={form.model} onChange={(e) => set("model", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Year</label>
              <input type="number" className={inputCls} value={form.year} onChange={(e) => set("year", Number(e.target.value))} />
            </div>
          </div>

          {/* Price / Mileage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Price (CAD) *</label>
              <input type="number" className={inputCls} placeholder="22900" value={form.price || ""} onChange={(e) => set("price", Number(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Mileage (mi)</label>
              <input type="number" className={inputCls} placeholder="18500" value={form.mileage || ""} onChange={(e) => set("mileage", Number(e.target.value))} />
            </div>
          </div>

          {/* Transmission / Fuel / Body / Drive */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Transmission</label>
              <select className={inputCls + " cursor-pointer"} value={form.transmission} onChange={(e) => set("transmission", e.target.value)}>
                {["Automatic", "Manual", "CVT", "Semi-Automatic"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Fuel Type</label>
              <select className={inputCls + " cursor-pointer"} value={form.fuelType} onChange={(e) => set("fuelType", e.target.value)}>
                {["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Body Style</label>
              <select className={inputCls + " cursor-pointer"} value={form.bodyStyle} onChange={(e) => set("bodyStyle", e.target.value)}>
                {["Sedan", "Coupe", "SUV", "Truck", "Hatchback", "Convertible", "Wagon", "Van"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Drive Type</label>
              <select className={inputCls + " cursor-pointer"} value={form.driveType} onChange={(e) => set("driveType", e.target.value)}>
                {["FWD", "RWD", "AWD", "4WD"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Engine / HP / Color / VIN */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Engine Size</label>
              <input className={inputCls} placeholder="2.5L 4-Cylinder" value={form.engineSize} onChange={(e) => set("engineSize", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Horsepower</label>
              <input type="number" className={inputCls} placeholder="203" value={form.horsepower || ""} onChange={(e) => set("horsepower", Number(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Color</label>
              <input className={inputCls} placeholder="Midnight Black" value={form.color} onChange={(e) => set("color", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>VIN</label>
              <input className={inputCls} placeholder="1HGCV2F34LA012874" value={form.vin} onChange={(e) => set("vin", e.target.value)} />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelCls}>Vehicle Images</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("image-input")?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                dragOver ? "border-[#8F8F93] bg-[#2A2A2A]" : "border-[#404040] hover:border-[#8F8F93]"
              }`}
            >
              <Upload className="w-5 h-5 text-[#8F8F93] mx-auto mb-2" />
              <p className="text-[#BDBDBD] text-sm">Drag & drop images or click to upload</p>
              <input
                id="image-input"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                disabled={uploadingImage}
              />
            </div>
            {form.images.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-[#8F8F93] text-xs uppercase tracking-wider font-medium">{form.images.length} image(s)</p>
                <div className="grid grid-cols-3 gap-2">
                  {form.images.filter(Boolean).map((img, i) => (
                    <div key={i} className="relative aspect-square rounded bg-[#2A2A2A] border border-[#404040] group overflow-hidden">
                      {img.startsWith("/uploads/") || img.startsWith("/api/uploads/") ? (
                        <img src={img} alt={`Vehicle ${i}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#8F8F93] text-xs text-center p-1">
                          {(() => {
                            try {
                              return new URL(img).hostname;
                            } catch {
                              return img.substring(0, 20);
                            }
                          })()}
                        </div>
                      )}
                      <button
                        onClick={() => set("images", form.images.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-600/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={3} className={inputCls + " resize-none"} placeholder="Vehicle description..." value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          {/* Features */}
          <div>
            <label className={labelCls}>Features</label>
            <div className="flex gap-2 mb-2">
              <input className={inputCls} placeholder="Apple CarPlay & Android Auto" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }} />
              <button onClick={addFeature} className="px-3 py-2.5 bg-white text-[#1F1E1C] rounded text-sm font-semibold hover:bg-[#BDBDBD] transition-colors cursor-pointer shrink-0">Add</button>
            </div>
            {form.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.features.map((f, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#2A2A2A] border border-[#404040] rounded text-xs text-[#BDBDBD]">
                    {f}
                    <button onClick={() => set("features", form.features.filter((_, j) => j !== i))} className="text-[#8F8F93] hover:text-white cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div onClick={() => set("isFeatured", !form.isFeatured)} className={`w-10 h-6 rounded-full transition-colors cursor-pointer flex items-center ${form.isFeatured ? "bg-white" : "bg-[#404040]"}`}>
                <div className={`w-4 h-4 bg-[#1F1E1C] rounded-full transition-transform mx-1 ${form.isFeatured ? "translate-x-4" : "translate-x-0"}`} />
              </div>
              <span className="text-[#BDBDBD] text-sm">Featured</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div onClick={() => set("status", form.status === "available" ? "sold" : "available")} className={`w-10 h-6 rounded-full transition-colors cursor-pointer flex items-center ${form.status === "available" ? "bg-white" : "bg-[#404040]"}`}>
                <div className={`w-4 h-4 bg-[#1F1E1C] rounded-full transition-transform mx-1 ${form.status === "available" ? "translate-x-4" : "translate-x-0"}`} />
              </div>
              <span className="text-[#BDBDBD] text-sm">Available</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-[#404040] sticky bottom-0 bg-[#252525]">
          <button onClick={onClose} className="flex-1 py-3 border border-[#404040] text-[#BDBDBD] text-sm rounded hover:border-[#8F8F93] hover:text-white transition-all cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSave} disabled={!form.make || !form.model || !form.price}
            className="flex-1 py-3 bg-white text-[#1F1E1C] font-semibold text-sm rounded hover:bg-[#BDBDBD] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            {isEdit ? "Save Changes" : "Add Vehicle"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── User Modal ───────────────────────────────────────────────────────────────
function UserModal({ user, roles, onSave, onClose }: { user: AdminUser | null; roles: Role[]; onSave: (u: AdminUser) => void; onClose: () => void }) {
  const [form, setForm] = useState<AdminUser>(user ?? { id: "", name: "", email: "", role: roles[0]?.name ?? "Editor", status: "active", createdAt: "" });
  const set = (k: keyof AdminUser, v: string) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-[#252525] border border-[#404040] rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-white text-lg">{user ? "Edit User" : "Add User"}</h2>
          <button onClick={onClose} className="text-[#8F8F93] hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[#8F8F93] text-xs uppercase tracking-wider mb-1.5 font-medium">Full Name *</label>
            <input className="w-full bg-[#2A2A2A] border border-[#404040] text-white placeholder-[#8F8F93] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#8F8F93] transition-colors"
              placeholder="John Smith" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label className="block text-[#8F8F93] text-xs uppercase tracking-wider mb-1.5 font-medium">Email *</label>
            <input type="email" className="w-full bg-[#2A2A2A] border border-[#404040] text-white placeholder-[#8F8F93] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#8F8F93] transition-colors"
              placeholder="user@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <label className="block text-[#8F8F93] text-xs uppercase tracking-wider mb-1.5 font-medium">Role</label>
            <select className="w-full bg-[#2A2A2A] border border-[#404040] text-white rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#8F8F93] transition-colors cursor-pointer"
              value={form.role} onChange={(e) => set("role", e.target.value)}>
              {roles.map((r) => <option key={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[#8F8F93] text-xs uppercase tracking-wider mb-1.5 font-medium">Status</label>
            <select className="w-full bg-[#2A2A2A] border border-[#404040] text-white rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#8F8F93] transition-colors cursor-pointer"
              value={form.status} onChange={(e) => set("status", e.target.value as "active" | "inactive")}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 border border-[#404040] text-[#BDBDBD] text-sm rounded hover:border-[#8F8F93] cursor-pointer">Cancel</button>
          <button onClick={() => onSave(form)} disabled={!form.name || !form.email}
            className="flex-1 py-2.5 bg-white text-[#1F1E1C] text-sm font-semibold rounded hover:bg-[#BDBDBD] disabled:opacity-40 cursor-pointer">
            {user ? "Save Changes" : "Create User"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Role Modal ────────────────────────────────────────────────────────────────
const ALL_SECTIONS = ["dashboard","vehicles","listings","brands","testimonials","contact","sell","media","users","roles","finance","finance-settings"];
function RoleModal({ role, onSave, onClose }: { role: Role | null; onSave: (r: Role) => void; onClose: () => void }) {
  const [form, setForm] = useState<Role>(role ?? { id: "", name: "", description: "", permissions: [], color: "gray" });
  const togglePerm = (p: string) =>
    setForm((f) => ({ ...f, permissions: f.permissions.includes(p) ? f.permissions.filter((x) => x !== p) : [...f.permissions, p] }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-[#252525] border border-[#404040] rounded-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-white text-lg">{role ? "Edit Role" : "Add Role"}</h2>
          <button onClick={onClose} className="text-[#8F8F93] hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[#8F8F93] text-xs uppercase tracking-wider mb-1.5 font-medium">Role Name *</label>
            <input className="w-full bg-[#2A2A2A] border border-[#404040] text-white placeholder-[#8F8F93] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#8F8F93] transition-colors"
              placeholder="e.g. Manager" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-[#8F8F93] text-xs uppercase tracking-wider mb-1.5 font-medium">Description</label>
            <input className="w-full bg-[#2A2A2A] border border-[#404040] text-white placeholder-[#8F8F93] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#8F8F93] transition-colors"
              placeholder="Brief description of this role" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className="block text-[#8F8F93] text-xs uppercase tracking-wider mb-2 font-medium">Permissions</label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_SECTIONS.map((s) => (
                <button key={s} onClick={() => togglePerm(s)}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-all cursor-pointer ${
                    form.permissions.includes(s) ? "bg-[#C8A96E]/15 border border-[#C8A96E]/40 text-[#C8A96E]" : "bg-[#2A2A2A] border border-[#404040] text-[#8F8F93] hover:border-[#8F8F93]"
                  }`}>
                  <CheckCircle className={`w-3.5 h-3.5 ${form.permissions.includes(s) ? "text-[#C8A96E]" : "text-[#555]"}`} />
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 border border-[#404040] text-[#BDBDBD] text-sm rounded hover:border-[#8F8F93] cursor-pointer">Cancel</button>
          <button onClick={() => onSave(form)} disabled={!form.name}
            className="flex-1 py-2.5 bg-white text-[#1F1E1C] text-sm font-semibold rounded hover:bg-[#BDBDBD] disabled:opacity-40 cursor-pointer">
            {role ? "Save Changes" : "Create Role"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteConfirm({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-[#252525] border border-[#404040] rounded-xl w-full max-w-sm p-7 text-center">
        <div className="w-14 h-14 bg-red-900/30 border border-red-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <h3 className="font-heading font-bold text-white text-xl mb-2">Delete Vehicle?</h3>
        <p className="text-[#BDBDBD] text-sm mb-6">{name} will be permanently removed from inventory.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-[#404040] text-[#BDBDBD] text-sm rounded hover:border-[#8F8F93] hover:text-white transition-all cursor-pointer">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-600 text-white font-semibold text-sm rounded hover:bg-red-700 transition-colors cursor-pointer">Delete</button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-[#252525] border border-[#404040] rounded-xl px-5 py-3.5 shadow-2xl">
      <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
      <span className="text-white text-sm font-medium">{message}</span>
    </motion.div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username !== ADMIN_USER) { setError("Invalid username or password."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        localStorage.setItem(AUTH_KEY, "true");
        onLogin();
      } else {
        setError("Invalid username or password.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F1E1C] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-5">
            <span className="text-[#1F1E1C] font-heading font-bold text-xl">AM</span>
          </div>
          <h1 className="font-heading font-bold text-white text-3xl mb-1">Admin Panel</h1>
          <p className="text-[#8F8F93] text-sm">Sign in to manage your inventory</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#252525] border border-[#404040] rounded-xl p-8 space-y-5">
          <div>
            <label className={labelCls}>Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F8F93]" />
              <input
                type="text"
                autoComplete="username"
                className={inputCls + " pl-9"}
                placeholder="admin"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F8F93]" />
              <input
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                className={inputCls + " pl-9 pr-10"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8F8F93] hover:text-white transition-colors cursor-pointer text-xs">
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded px-3 py-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-white text-[#1F1E1C] font-semibold text-sm rounded hover:bg-[#BDBDBD] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Main Admin ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [inventory, setInventory] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; vehicle: Partial<Vehicle> | null }>({ open: false, vehicle: null });
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");

  // Listings state
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState("");
  const [listingFilter, setListingFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [reviewModal, setReviewModal] = useState<{ listing: Listing | null; action: "approve" | "reject" | null }>({ listing: null, action: null });
  const [adminNote, setAdminNote] = useState("");

  // Brands state
  const [brands, setBrands] = useState<{ id: string; name: string; count: number }[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [brandsError, setBrandsError] = useState("");
  const [brandModal, setBrandModal] = useState<{ open: boolean; brand: { id: string; name: string; count: number } | null }>({ open: false, brand: null });
  const [brandForm, setBrandForm] = useState({ name: "", count: "0" });
  const [brandFormError, setBrandFormError] = useState("");
  const [brandSaving, setBrandSaving] = useState(false);
  const [brandDeleteTarget, setBrandDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Testimonials state
  const [testimonials, setTestimonials] = useState<{ id: string; name: string; role: string; content: string; rating: number }[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [testimonialsError, setTestimonialsError] = useState("");
  const [testimonialModal, setTestimonialModal] = useState<{ open: boolean; item: { id: string; name: string; role: string; content: string; rating: number } | null }>({ open: false, item: null });
  const [testimonialForm, setTestimonialForm] = useState({ name: "", role: "Happy Customer", content: "", rating: "5" });
  const [testimonialFormError, setTestimonialFormError] = useState("");
  const [testimonialSaving, setTestimonialSaving] = useState(false);
  const [testimonialDeleteTarget, setTestimonialDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Finance Applications state
  const [financeApps, setFinanceApps] = useState<{id:string;name:string;email:string;phone:string;annualIncome?:string;employmentStatus?:string;vehiclePrice?:string;requestedRate?:number;requestedTerm?:number;submittedAt:string;status:string}[]>([]);
  const [financeAppsLoading, setFinanceAppsLoading] = useState(false);

  // Contact Requests state
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  // Media Library state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaAddOpen, setMediaAddOpen] = useState(false);
  const [mediaUrlInput, setMediaUrlInput] = useState("");
  const [mediaNameInput, setMediaNameInput] = useState("");

  // Users & Roles state
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userModal, setUserModal] = useState<{ open: boolean; user: AdminUser | null }>({ open: false, user: null });
  const [roleModal, setRoleModal] = useState<{ open: boolean; role: Role | null }>({ open: false, role: null });

  // Change password state
  const [pwModal, setPwModal] = useState<{ open: boolean; userId: string | null; userName: string }>({ open: false, userId: null, userName: "" });
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  // Finance Settings state
  const [financeSettings, setFinanceSettings] = useState({ defaultRate: 5.99, defaultTerm: 84, defaultDeposit: 5000, defaultVehiclePrice: 40000, minRate: 1.99, maxRate: 29.99 });
  const [financeLoading, setFinanceLoading] = useState(false);
  const [financeSaving, setFinanceSaving] = useState(false);
  const [financeMsg, setFinanceMsg] = useState("");

  // Restore auth from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(AUTH_KEY) === "true") {
      setAuthed(true);
    }
  }, []);

  // Fetch vehicles on auth
  useEffect(() => {
    if (authed) fetchVehicles();
  }, [authed]);

  // Fetch listings whenever the tab is opened
  useEffect(() => {
    if ((activeTab === "listings" || activeTab === "sell") && authed) fetchListings();
  }, [activeTab, authed]);

  // Fetch brands whenever the tab is opened
  useEffect(() => {
    if (activeTab === "brands" && authed) fetchBrands();
  }, [activeTab, authed]);

  // Fetch testimonials whenever the tab is opened
  useEffect(() => {
    if (activeTab === "testimonials" && authed) fetchTestimonials();
  }, [activeTab, authed]);

  // Fetch finance applications whenever the tab is opened
  useEffect(() => {
    if (activeTab === "finance" && authed) {
      setFinanceAppsLoading(true);
      fetch("/api/finance-applications")
        .then((r) => r.json())
        .then((d) => Array.isArray(d) && setFinanceApps(d))
        .catch(() => {})
        .finally(() => setFinanceAppsLoading(false));
    }
  }, [activeTab, authed]);

  // Fetch contacts whenever the tab is opened
  useEffect(() => {
    if (activeTab === "contact" && authed) fetchContacts();
  }, [activeTab, authed]);

  // Fetch media whenever the tab is opened
  useEffect(() => {
    if (activeTab === "media" && authed) fetchMedia();
  }, [activeTab, authed]);

  // Fetch users/roles whenever those tabs are opened
  useEffect(() => {
    if ((activeTab === "users" || activeTab === "roles") && authed) fetchUsersAndRoles();
  }, [activeTab, authed]);

  // Fetch finance settings when that tab is opened
  useEffect(() => {
    if (activeTab === "finance-settings" && authed) {
      setFinanceLoading(true);
      fetch("/api/finance")
        .then((r) => r.json())
        .then((s) => setFinanceSettings((prev) => ({ ...prev, ...s })))
        .catch(() => {})
        .finally(() => setFinanceLoading(false));
    }
  }, [activeTab, authed]);

  const fetchVehicles = async () => {
    setVehiclesLoading(true);
    try {
      const res = await fetch("/api/vehicles");
      if (res.ok) setInventory(await res.json());
    } finally {
      setVehiclesLoading(false);
    }
  };

  const fetchListings = async () => {
    setListingsLoading(true);
    setListingsError("");
    try {
      const res = await fetch("/api/listings");
      if (!res.ok) throw new Error("Failed to load listings");
      const data: Listing[] = await res.json();
      setListings(data);
    } catch (err) {
      setListingsError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setListingsLoading(false);
    }
  };

  const handleReviewListing = async (listing: Listing, action: "approve" | "reject") => {
    try {
      const res = await fetch(`/api/listings/${listing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action === "approve" ? "approved" : "rejected", adminNote }),
      });
      if (!res.ok) throw new Error("Failed to update listing");
      const updated: Listing = await res.json();
      setListings((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      setReviewModal({ listing: null, action: null });
      setAdminNote("");
      showToast(`Listing ${action === "approve" ? "approved" : "rejected"}: ${listing.make} ${listing.model}`);
    } catch (err) {
      showToast("Error: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const fetchBrands = async () => {
    setBrandsLoading(true);
    setBrandsError("");
    try {
      const res = await fetch("/api/brands");
      if (!res.ok) throw new Error("Failed to load brands");
      setBrands(await res.json());
    } catch (err) {
      setBrandsError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setBrandsLoading(false);
    }
  };

  const openBrandModal = (brand: { id: string; name: string; count: number } | null) => {
    setBrandForm(brand ? { name: brand.name, count: String(brand.count) } : { name: "", count: "0" });
    setBrandFormError("");
    setBrandModal({ open: true, brand });
  };

  const handleSaveBrand = async () => {
    if (!brandForm.name.trim()) { setBrandFormError("Brand name is required."); return; }
    setBrandSaving(true);
    setBrandFormError("");
    try {
      const isEdit = !!brandModal.brand;
      const url = isEdit ? `/api/brands/${brandModal.brand!.id}` : "/api/brands";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: brandForm.name.trim(), count: Number(brandForm.count) || 0 }),
      });
      const data = await res.json();
      if (!res.ok) { setBrandFormError(data.error || "Failed to save brand."); return; }
      if (isEdit) {
        setBrands((prev) => prev.map((b) => b.id === data.id ? data : b));
        showToast(`${data.name} updated.`);
      } else {
        setBrands((prev) => [...prev, data]);
        showToast(`${data.name} added.`);
      }
      setBrandModal({ open: false, brand: null });
    } catch {
      setBrandFormError("Network error. Please try again.");
    } finally {
      setBrandSaving(false);
    }
  };

  const handleDeleteBrand = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete brand");
      setBrands((prev) => prev.filter((b) => b.id !== id));
      setBrandDeleteTarget(null);
      showToast(`${name} removed.`);
    } catch (err) {
      showToast("Error: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const fetchTestimonials = async () => {
    setTestimonialsLoading(true);
    setTestimonialsError("");
    try {
      const res = await fetch("/api/testimonials");
      if (!res.ok) throw new Error("Failed to load testimonials");
      setTestimonials(await res.json());
    } catch (err) {
      setTestimonialsError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setTestimonialsLoading(false);
    }
  };

  const openTestimonialModal = (item: typeof testimonials[0] | null) => {
    setTestimonialForm(item
      ? { name: item.name, role: item.role, content: item.content, rating: String(item.rating) }
      : { name: "", role: "Happy Customer", content: "", rating: "5" }
    );
    setTestimonialFormError("");
    setTestimonialModal({ open: true, item });
  };

  const handleSaveTestimonial = async () => {
    if (!testimonialForm.name.trim()) { setTestimonialFormError("Name is required."); return; }
    if (!testimonialForm.content.trim()) { setTestimonialFormError("Review text is required."); return; }
    setTestimonialSaving(true);
    setTestimonialFormError("");
    try {
      const isEdit = !!testimonialModal.item;
      const url = isEdit ? `/api/testimonials/${testimonialModal.item!.id}` : "/api/testimonials";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: testimonialForm.name.trim(),
          role: testimonialForm.role.trim(),
          content: testimonialForm.content.trim(),
          rating: Number(testimonialForm.rating),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setTestimonialFormError(data.error || "Failed to save."); return; }
      if (isEdit) {
        setTestimonials((prev) => prev.map((t) => t.id === data.id ? data : t));
        showToast(`Review by ${data.name} updated.`);
      } else {
        setTestimonials((prev) => [...prev, data]);
        showToast(`Review by ${data.name} added.`);
      }
      setTestimonialModal({ open: false, item: null });
    } catch {
      setTestimonialFormError("Network error. Please try again.");
    } finally {
      setTestimonialSaving(false);
    }
  };

  const handleDeleteTestimonial = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      setTestimonialDeleteTarget(null);
      showToast(`Review by ${name} removed.`);
    } catch (err) {
      showToast("Error: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleDeleteListing = async (id: string) => {
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete listing");
      setListings((prev) => prev.filter((l) => l.id !== id));
      showToast("Listing deleted.");
    } catch (err) {
      showToast("Error: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const fetchContacts = async () => {
    setContactsLoading(true);
    try {
      const res = await fetch("/api/contacts");
      if (res.ok) setContacts(await res.json());
    } finally {
      setContactsLoading(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      setContacts((prev) => prev.filter((c) => c.id !== id));
      showToast("Contact request deleted.");
    } catch {
      showToast("Error deleting contact.");
    }
  };

  const fetchMedia = async () => {
    setMediaLoading(true);
    try {
      const res = await fetch("/api/media");
      if (res.ok) setMediaItems(await res.json());
    } finally {
      setMediaLoading(false);
    }
  };

  const handleAddMediaUrl = async () => {
    if (!mediaUrlInput.trim()) return;
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: mediaUrlInput.trim(), name: mediaNameInput.trim() || mediaUrlInput.trim() }),
      });
      if (res.ok) {
        const item = await res.json();
        setMediaItems((prev) => [item, ...prev]);
        setMediaUrlInput("");
        setMediaNameInput("");
        setMediaAddOpen(false);
        showToast("Image added to library.");
      }
    } catch {
      showToast("Error adding image.");
    }
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      await fetch(`/api/media/${id}`, { method: "DELETE" });
      setMediaItems((prev) => prev.filter((m) => m.id !== id));
      showToast("Image removed.");
    } catch {
      showToast("Error removing image.");
    }
  };

  const handleUploadMedia = async (files: FileList | null) => {
    if (!files || !files.length) return;
    for (const file of Array.from(files).slice(0, 20)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/media", { method: "POST", body: fd });
        if (res.ok) {
          const item = await res.json();
          setMediaItems((prev) => [item, ...prev]);
          showToast(`${file.name} uploaded.`);
        }
      } catch {
        showToast(`Error uploading ${file.name}.`);
      }
    }
  };

  const fetchUsersAndRoles = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(data.users);
        setRoles(data.roles);
      }
    } finally {
      setUsersLoading(false);
    }
  };

  const handleSaveUser = async (user: AdminUser) => {
    const isNew = !adminUsers.find((u) => u.id === user.id);
    const res = await fetch(isNew ? "/api/users" : `/api/users/${user.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (res.ok) {
      const saved = await res.json();
      setAdminUsers((prev) => isNew ? [...prev, saved] : prev.map((u) => u.id === saved.id ? saved : u));
      setUserModal({ open: false, user: null });
      showToast(isNew ? "User created." : "User updated.");
    }
  };

  const handleDeleteUser = async (id: string) => {
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    setAdminUsers((prev) => prev.filter((u) => u.id !== id));
    showToast("User deleted.");
  };

  const handleSaveRole = async (role: Role) => {
    const isNew = !roles.find((r) => r.id === role.id);
    const res = await fetch(isNew ? "/api/roles" : `/api/roles/${role.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(role),
    });
    if (res.ok) {
      const saved = await res.json();
      setRoles((prev) => isNew ? [...prev, saved] : prev.map((r) => r.id === saved.id ? saved : r));
      setRoleModal({ open: false, role: null });
      showToast(isNew ? "Role created." : "Role updated.");
    }
  };

  const handleDeleteRole = async (id: string) => {
    await fetch(`/api/roles/${id}`, { method: "DELETE" });
    setRoles((prev) => prev.filter((r) => r.id !== id));
    showToast("Role deleted.");
  };

  const handleChangePassword = async () => {
    setPwError("");
    if (pwNew.length < 6) { setPwError("New password must be at least 6 characters."); return; }
    if (pwNew !== pwConfirm) { setPwError("Passwords do not match."); return; }
    setPwSaving(true);
    try {
      if (pwModal.userId) {
        // Changing a specific user's password (Super Admin action)
        const res = await fetch(`/api/users/${pwModal.userId}/password`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword: pwNew }),
        });
        if (!res.ok) { const d = await res.json(); setPwError(d.error || "Failed."); return; }
      } else {
        // Changing the admin login password
        const res = await fetch("/api/auth", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew }),
        });
        if (!res.ok) { const d = await res.json(); setPwError(d.error || "Failed."); return; }
      }
      setPwModal({ open: false, userId: null, userName: "" });
      setPwCurrent(""); setPwNew(""); setPwConfirm(""); setPwError("");
      showToast("Password updated successfully.");
    } catch {
      setPwError("Network error. Please try again.");
    } finally {
      setPwSaving(false);
    }
  };

  const handleSaveFinance = async () => {
    setFinanceSaving(true);
    setFinanceMsg("");
    try {
      const res = await fetch("/api/finance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(financeSettings),
      });
      if (!res.ok) throw new Error("Failed to save");
      const updated = await res.json();
      setFinanceSettings((prev) => ({ ...prev, ...updated }));
      setFinanceMsg("Settings saved successfully.");
    } catch {
      setFinanceMsg("Failed to save. Please try again.");
    } finally {
      setFinanceSaving(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  const showToast = (msg: string) => setToast(msg);

  const handleSave = async (vehicle: Vehicle) => {
    const isEdit = inventory.some((v) => v.id === vehicle.id);
    try {
      const res = await fetch(
        isEdit ? `/api/vehicles/${vehicle.id}` : "/api/vehicles",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vehicle),
        }
      );
      if (!res.ok) throw new Error("Save failed");
      const saved: Vehicle = await res.json();
      setInventory((prev) => {
        const idx = prev.findIndex((v) => v.id === saved.id);
        if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; }
        return [saved, ...prev];
      });
      setModal({ open: false, vehicle: null });
      showToast(`${saved.make} ${saved.model} saved.`);
    } catch {
      showToast("Error saving vehicle.");
    }
  };

  const handleDelete = async (v: Vehicle) => {
    try {
      await fetch(`/api/vehicles/${v.id}`, { method: "DELETE" });
      setInventory((prev) => prev.filter((x) => x.id !== v.id));
      setDeleteTarget(null);
      showToast(`${v.make} ${v.model} deleted.`);
    } catch {
      showToast("Error deleting vehicle.");
    }
  };

  const toggleStatus = async (id: string) => {
    const v = inventory.find((x) => x.id === id);
    if (!v) return;
    const newStatus = v.status === "available" ? "sold" : "available";
    setInventory((prev) => prev.map((x) => x.id === id ? { ...x, status: newStatus } : x));
    try {
      await fetch(`/api/vehicles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      setInventory((prev) => prev.map((x) => x.id === id ? { ...x, status: v.status } : x));
    }
  };

  const toggleFeatured = async (id: string) => {
    const v = inventory.find((x) => x.id === id);
    if (!v) return;
    const newFeatured = !v.isFeatured;
    setInventory((prev) => prev.map((x) => x.id === id ? { ...x, isFeatured: newFeatured } : x));
    try {
      await fetch(`/api/vehicles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: newFeatured }),
      });
    } catch {
      setInventory((prev) => prev.map((x) => x.id === id ? { ...x, isFeatured: v.isFeatured } : x));
    }
  };

  const filtered = inventory.filter((v) =>
    search === "" ||
    `${v.make} ${v.model} ${v.year}`.toLowerCase().includes(search.toLowerCase())
  );

  const dashStats = [
    { label: "Total Vehicles", value: String(inventory.length), change: "In inventory", icon: Car },
    { label: "Available", value: String(inventory.filter((v) => v.status === "available").length), change: "Ready to sell", icon: CheckCircle },
    { label: "Sold", value: String(inventory.filter((v) => v.status === "sold").length), change: "This period", icon: TrendingUp },
    { label: "Featured", value: String(inventory.filter((v) => v.isFeatured).length), change: "On homepage", icon: Star },
  ];

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  return (
    <div className="flex h-screen bg-[#1F1E1C] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#161614] border-r border-[#404040] flex flex-col shrink-0">
        <div className="p-6 border-b border-[#404040]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-[#1F1E1C] font-heading font-bold text-xs">AM</span>
            </div>
            <div>
              <p className="text-white font-heading font-bold text-sm">AERO MOTORS</p>
              <p className="text-[#8F8F93] text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors cursor-pointer ${isActive ? "bg-white/10 text-white border-r-2 border-white" : "text-[#BDBDBD] hover:text-white hover:bg-white/5"}`}>
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
                {item.id === "vehicles" && (
                  <span className="ml-auto bg-[#2A2A2A] text-[#8F8F93] text-xs px-2 py-0.5 rounded-full">{inventory.length}</span>
                )}
                {item.id === "listings" && listings.filter((l) => l.status === "pending").length > 0 && (
                  <span className="ml-auto bg-[#C8A96E]/20 text-[#C8A96E] text-xs px-2 py-0.5 rounded-full font-semibold">
                    {listings.filter((l) => l.status === "pending").length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#404040]">
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
            <div className="w-7 h-7 bg-[#2A2A2A] border border-[#404040] rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">admin</p>
              <p className="text-[#8F8F93] text-xs">Administrator</p>
            </div>
          </div>
          <button onClick={() => { setPwCurrent(""); setPwNew(""); setPwConfirm(""); setPwError(""); setPwModal({ open: true, userId: null, userName: "Admin Login" }); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#8F8F93] hover:text-white hover:bg-white/5 rounded transition-colors cursor-pointer">
            <Lock className="w-4 h-4" />
            Change Password
          </button>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#8F8F93] hover:text-white hover:bg-white/5 rounded transition-colors cursor-pointer">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-[#161614] border-b border-[#404040] flex items-center justify-between px-6 shrink-0">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F8F93]" />
            <input type="text" placeholder="Search vehicles..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-[#404040] text-white text-sm rounded pl-9 pr-4 py-2 focus:outline-none focus:border-[#8F8F93] transition-colors placeholder-[#8F8F93]" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative w-9 h-9 flex items-center justify-center text-[#8F8F93] hover:text-white border border-[#404040] rounded-lg transition-colors cursor-pointer">
              <Bell className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#2A2A2A] border border-[#404040] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">admin</p>
                <p className="text-[#8F8F93] text-xs">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">

          {/* ── Dashboard ── */}
          {activeTab === "dashboard" && (
            <div>
              <div className="mb-8">
                <h1 className="font-heading font-bold text-white text-3xl mb-1">Dashboard</h1>
                <p className="text-[#8F8F93] text-sm">Welcome back. Here&apos;s a snapshot of your inventory.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {dashStats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                      className="bg-[#252525] border border-[#404040] rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[#8F8F93] text-sm">{stat.label}</p>
                        <div className="w-9 h-9 bg-[#2A2A2A] border border-[#404040] rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 text-[#8F8F93]" />
                        </div>
                      </div>
                      <p className="font-heading font-bold text-white text-3xl mb-1">{stat.value}</p>
                      <p className="text-[#8F8F93] text-xs">{stat.change}</p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#252525] border border-[#404040] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-heading font-semibold text-white">Recent Vehicles</h2>
                    <button onClick={() => setActiveTab("vehicles")} className="flex items-center gap-1 text-[#8F8F93] hover:text-white text-sm transition-colors cursor-pointer">
                      View All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {inventory.slice(0, 5).map((v) => (
                      <div key={v.id} className="flex items-center justify-between py-3 border-b border-[#404040] last:border-0">
                        <div>
                          <p className="text-white text-sm font-medium">{v.year} {v.make} {v.model}</p>
                          <p className="text-[#8F8F93] text-xs">{v.bodyStyle} · {new Intl.NumberFormat("en-US").format(v.mileage)} mi</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium text-sm">{new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", currencyDisplay: "code", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v.price)}</p>
                          <span className={`text-xs px-2 py-0.5 rounded ${v.status === "available" ? "bg-green-900/50 text-green-400" : "bg-red-900/40 text-red-400"}`}>{v.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#252525] border border-[#404040] rounded-xl p-6">
                  <h2 className="font-heading font-semibold text-white mb-5">Quick Actions</h2>
                  <div className="space-y-2">
                    {[
                      { label: "Add New Vehicle", icon: Plus, action: () => setModal({ open: true, vehicle: null }) },
                      { label: "View Inventory", icon: Car, action: () => setActiveTab("vehicles") },
                      { label: "Finance Requests", icon: CreditCard, action: () => setActiveTab("finance") },
                      { label: "Sell Requests", icon: Truck, action: () => setActiveTab("sell") },
                      { label: "View Analytics", icon: BarChart3, action: () => {} },
                    ].map(({ label, icon: Icon, action }) => (
                      <button key={label} onClick={action} className="w-full flex items-center justify-between p-3.5 bg-[#2A2A2A] border border-[#404040] rounded-lg hover:border-[#8F8F93] transition-all text-sm text-[#BDBDBD] hover:text-white cursor-pointer">
                        <div className="flex items-center gap-3"><Icon className="w-4 h-4 text-[#8F8F93]" />{label}</div>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Vehicles ── */}
          {activeTab === "vehicles" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-heading font-bold text-white text-3xl mb-1">Vehicles</h1>
                  <p className="text-[#8F8F93] text-sm">{filtered.length} of {inventory.length} vehicles</p>
                </div>
                <button onClick={() => setModal({ open: true, vehicle: null })}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#1F1E1C] font-semibold text-sm rounded hover:bg-[#BDBDBD] transition-colors cursor-pointer">
                  <Plus className="w-4 h-4" /> Add Vehicle
                </button>
              </div>

              <div className="bg-[#252525] border border-[#404040] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#404040]">
                        {["Vehicle", "Year", "Price", "Mileage", "Status", "Featured", "Actions"].map((h) => (
                          <th key={h} className="text-left text-[#8F8F93] text-xs font-medium uppercase tracking-wider px-5 py-3.5">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-12 text-center text-[#8F8F93] text-sm">No vehicles found.</td>
                        </tr>
                      ) : filtered.map((v) => (
                        <tr key={v.id} className="border-b border-[#404040] last:border-0 hover:bg-[#2A2A2A] transition-colors">
                          <td className="px-5 py-4">
                            <p className="text-white text-sm font-medium">{v.make} {v.model}</p>
                            <p className="text-[#8F8F93] text-xs">{v.bodyStyle} · {v.transmission}</p>
                          </td>
                          <td className="px-5 py-4 text-[#BDBDBD] text-sm">{v.year}</td>
                          <td className="px-5 py-4 text-white text-sm font-medium">
                            {new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", currencyDisplay: "code", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v.price)}
                          </td>
                          <td className="px-5 py-4 text-[#BDBDBD] text-sm">{new Intl.NumberFormat("en-US").format(v.mileage)} mi</td>
                          <td className="px-5 py-4">
                            <button onClick={() => toggleStatus(v.id)} title="Toggle status"
                              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-opacity hover:opacity-70 cursor-pointer ${v.status === "available" ? "bg-green-900/40 text-green-400" : "bg-red-900/40 text-red-400"}`}>
                              {v.status}
                            </button>
                          </td>
                          <td className="px-5 py-4">
                            <button onClick={() => toggleFeatured(v.id)} title="Toggle featured" className="cursor-pointer">
                              {v.isFeatured
                                ? <ToggleRight className="w-7 h-7 text-white" />
                                : <ToggleLeft className="w-7 h-7 text-[#404040]" />}
                            </button>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-3">
                              <button onClick={() => setModal({ open: true, vehicle: v })}
                                className="flex items-center gap-1 text-xs text-[#8F8F93] hover:text-white transition-colors cursor-pointer">
                                <Edit2 className="w-3.5 h-3.5" /> Edit
                              </button>
                              <button onClick={() => setDeleteTarget(v)}
                                className="flex items-center gap-1 text-xs text-[#8F8F93] hover:text-red-400 transition-colors cursor-pointer">
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                              <a href={`/inventory/${v.id}`} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-[#8F8F93] hover:text-white transition-colors">
                                <Eye className="w-3.5 h-3.5" /> View
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Listings (Sell Requests) ── */}
          {activeTab === "listings" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-heading font-bold text-white text-3xl mb-1">Listing Requests</h1>
                  <p className="text-[#8F8F93] text-sm">
                    {listings.filter((l) => l.status === "pending").length} pending · {listings.length} total
                  </p>
                </div>
                <button onClick={fetchListings} disabled={listingsLoading}
                  className="flex items-center gap-2 px-4 py-2 border border-[#404040] text-[#8F8F93] hover:text-white hover:border-[#8F8F93] text-sm rounded transition-all cursor-pointer">
                  <RefreshCw className={`w-4 h-4 ${listingsLoading ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>

              {/* Status filter tabs */}
              <div className="flex gap-2 mb-6">
                {(["all", "pending", "approved", "rejected"] as const).map((s) => {
                  const count = s === "all" ? listings.length : listings.filter((l) => l.status === s).length;
                  return (
                    <button key={s} onClick={() => setListingFilter(s)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer capitalize ${
                        listingFilter === s
                          ? "bg-white text-[#1F1E1C]"
                          : "border border-[#404040] text-[#8F8F93] hover:text-white hover:border-[#8F8F93]"
                      }`}>
                      {s} <span className="ml-1 opacity-70">({count})</span>
                    </button>
                  );
                })}
              </div>

              {listingsError && (
                <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-800/40 rounded-xl mb-6 text-red-300 text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  {listingsError}
                </div>
              )}

              {listingsLoading ? (
                <div className="flex items-center justify-center h-40 text-[#8F8F93] text-sm gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Loading listings...
                </div>
              ) : (
                <div className="space-y-4">
                  {listings
                    .filter((l) => listingFilter === "all" || l.status === listingFilter)
                    .length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center text-[#8F8F93] text-sm">
                      <ClipboardList className="w-10 h-10 mb-3 opacity-40" />
                      No {listingFilter !== "all" ? listingFilter : ""} listing requests.
                    </div>
                  ) : listings
                    .filter((l) => listingFilter === "all" || l.status === listingFilter)
                    .map((listing) => (
                      <motion.div key={listing.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                        className="bg-[#252525] border border-[#404040] rounded-xl p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                          {/* Left: vehicle info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="font-heading font-semibold text-white text-lg">
                                {listing.year} {listing.make} {listing.model}
                              </h3>
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                listing.status === "pending" ? "bg-[#C8A96E]/20 text-[#C8A96E]" :
                                listing.status === "approved" ? "bg-green-900/40 text-green-400" :
                                "bg-red-900/40 text-red-400"
                              }`}>
                                {listing.status === "pending" ? "⏳ Pending" : listing.status === "approved" ? "✓ Approved" : "✗ Rejected"}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                              {[
                                ["Mileage", `${Number(listing.mileage).toLocaleString()} mi`],
                                ["Transmission", listing.transmission],
                                ["Condition", listing.condition],
                                ["Color", listing.color || "—"],
                              ].map(([l, v]) => (
                                <div key={l}>
                                  <p className="text-[#8F8F93] text-[10px] uppercase tracking-wider mb-0.5">{l}</p>
                                  <p className="text-white text-sm">{v}</p>
                                </div>
                              ))}
                            </div>

                            {/* Seller info */}
                            <div className="flex flex-wrap gap-4 text-sm border-t border-[#404040] pt-4">
                              <span className="flex items-center gap-1.5 text-[#BDBDBD]">
                                <User className="w-3.5 h-3.5 text-[#8F8F93]" />
                                {listing.sellerName}
                              </span>
                              <a href={`tel:${listing.sellerPhone}`} className="flex items-center gap-1.5 text-[#BDBDBD] hover:text-white transition-colors">
                                <Phone className="w-3.5 h-3.5 text-[#8F8F93]" />
                                {listing.sellerPhone}
                              </a>
                              <a href={`mailto:${listing.sellerEmail}`} className="flex items-center gap-1.5 text-[#BDBDBD] hover:text-white transition-colors">
                                <Mail className="w-3.5 h-3.5 text-[#8F8F93]" />
                                {listing.sellerEmail}
                              </a>
                              <span className="flex items-center gap-1.5 text-[#8F8F93] text-xs">
                                <Clock className="w-3 h-3" />
                                {new Date(listing.submittedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            </div>

                            {listing.comments && (
                              <p className="mt-3 text-[#BDBDBD] text-sm italic border-l-2 border-[#404040] pl-3">
                                &ldquo;{listing.comments}&rdquo;
                              </p>
                            )}
                            {listing.adminNote && (
                              <p className="mt-3 text-xs text-[#8F8F93] bg-[#2A2A2A] rounded px-3 py-2">
                                <span className="font-semibold text-white">Admin note:</span> {listing.adminNote}
                              </p>
                            )}
                            {listing.imageUrls && listing.imageUrls.length > 0 && (
                              <div className="mt-4">
                                <p className="text-[#8F8F93] text-[10px] uppercase tracking-wider mb-2 font-medium">
                                  {listing.imageUrls.length} Photo{listing.imageUrls.length !== 1 ? "s" : ""}
                                </p>
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                  {listing.imageUrls.map((url, i) => (
                                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                                      className="relative aspect-square rounded-lg overflow-hidden bg-[#2A2A2A] border border-[#404040] hover:border-[#C8A96E]/40 transition-colors group">
                                      <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right: actions */}
                          <div className="flex lg:flex-col gap-2 lg:w-36 shrink-0">
                            {listing.status === "pending" && (
                              <>
                                <button
                                  onClick={() => { setReviewModal({ listing, action: "approve" }); setAdminNote(""); }}
                                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-900/30 border border-green-800/50 text-green-400 hover:bg-green-900/50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                                >
                                  <ThumbsUp className="w-3.5 h-3.5" /> Approve
                                </button>
                                <button
                                  onClick={() => { setReviewModal({ listing, action: "reject" }); setAdminNote(""); }}
                                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-900/20 border border-red-800/40 text-red-400 hover:bg-red-900/40 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                                >
                                  <ThumbsDown className="w-3.5 h-3.5" /> Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteListing(listing.id)}
                              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-[#404040] text-[#8F8F93] hover:text-red-400 hover:border-red-800/40 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  }
                </div>
              )}
            </div>
          )}

          {/* ── Brands ── */}
          {activeTab === "brands" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-heading font-bold text-white text-3xl mb-1">Brands</h1>
                  <p className="text-[#8F8F93] text-sm">{brands.length} brand{brands.length !== 1 ? "s" : ""} · shown on homepage</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={fetchBrands} disabled={brandsLoading}
                    className="flex items-center gap-2 px-4 py-2 border border-[#404040] text-[#8F8F93] hover:text-white hover:border-[#8F8F93] text-sm rounded transition-all cursor-pointer">
                    <RefreshCw className={`w-4 h-4 ${brandsLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </button>
                  <button onClick={() => openBrandModal(null)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#1F1E1C] font-semibold text-sm rounded hover:bg-[#BDBDBD] transition-colors cursor-pointer">
                    <Plus className="w-4 h-4" /> Add Brand
                  </button>
                </div>
              </div>

              {brandsError && (
                <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-800/40 rounded-xl mb-6 text-red-300 text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0" />{brandsError}
                </div>
              )}

              {brandsLoading ? (
                <div className="flex items-center justify-center h-40 text-[#8F8F93] text-sm gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Loading brands...
                </div>
              ) : brands.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center text-[#8F8F93] text-sm">
                  <Tag className="w-10 h-10 mb-3 opacity-40" />
                  No brands yet. Add your first brand.
                </div>
              ) : (
                <div className="bg-[#252525] border border-[#404040] rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#404040]">
                        {["#", "Brand Name", "Initials", "Vehicle Count", "Actions"].map((h) => (
                          <th key={h} className="text-left text-[#8F8F93] text-xs font-medium uppercase tracking-wider px-5 py-3.5">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {brands.map((brand, i) => {
                        const initials = brand.name.split(/[\s\-]+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
                        return (
                          <motion.tr key={brand.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="border-b border-[#404040] last:border-0 hover:bg-[#2A2A2A] transition-colors">
                            <td className="px-5 py-4 text-[#8F8F93] text-sm">{i + 1}</td>
                            <td className="px-5 py-4">
                              <p className="text-white text-sm font-semibold font-heading">{brand.name}</p>
                            </td>
                            <td className="px-5 py-4">
                              <div className="w-9 h-9 rounded-lg bg-[#383532] border border-[#484542] flex items-center justify-center">
                                <span className="font-heading font-bold text-[#8A8880] text-xs tracking-wider">{initials}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#2A2A2A] border border-[#404040] rounded-full text-xs text-[#BDBDBD]">
                                <Car className="w-3 h-3 text-[#8F8F93]" />
                                {brand.count} vehicles
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex gap-4">
                                <button onClick={() => openBrandModal(brand)}
                                  className="flex items-center gap-1 text-xs text-[#8F8F93] hover:text-white transition-colors cursor-pointer">
                                  <Edit2 className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button onClick={() => setBrandDeleteTarget({ id: brand.id, name: brand.name })}
                                  className="flex items-center gap-1 text-xs text-[#8F8F93] hover:text-red-400 transition-colors cursor-pointer">
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                                <a href={`/inventory?make=${encodeURIComponent(brand.name)}`} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs text-[#8F8F93] hover:text-white transition-colors">
                                  <Eye className="w-3.5 h-3.5" /> View
                                </a>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Testimonials ── */}
          {activeTab === "testimonials" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-heading font-bold text-white text-3xl mb-1">Testimonials</h1>
                  <p className="text-[#8F8F93] text-sm">{testimonials.length} review{testimonials.length !== 1 ? "s" : ""} · shown on homepage</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={fetchTestimonials} disabled={testimonialsLoading}
                    className="flex items-center gap-2 px-4 py-2 border border-[#404040] text-[#8F8F93] hover:text-white hover:border-[#8F8F93] text-sm rounded transition-all cursor-pointer">
                    <RefreshCw className={`w-4 h-4 ${testimonialsLoading ? "animate-spin" : ""}`} /> Refresh
                  </button>
                  <button onClick={() => openTestimonialModal(null)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#1F1E1C] font-semibold text-sm rounded hover:bg-[#BDBDBD] transition-colors cursor-pointer">
                    <Plus className="w-4 h-4" /> Add Review
                  </button>
                </div>
              </div>

              {testimonialsError && (
                <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-800/40 rounded-xl mb-6 text-red-300 text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0" />{testimonialsError}
                </div>
              )}

              {testimonialsLoading ? (
                <div className="flex items-center justify-center h-40 text-[#8F8F93] text-sm gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Loading reviews...
                </div>
              ) : testimonials.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center text-[#8F8F93] text-sm">
                  <Star className="w-10 h-10 mb-3 opacity-40" />
                  No testimonials yet. Add your first review.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {testimonials.map((t, i) => (
                    <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="bg-[#252525] border border-[#404040] rounded-xl p-6 flex flex-col gap-4">
                      {/* Stars */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, si) => (
                            <Star key={si} className={`w-4 h-4 ${si < t.rating ? "fill-[#C8A96E] text-[#C8A96E]" : "text-[#404040]"}`} />
                          ))}
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => openTestimonialModal(t)}
                            className="flex items-center gap-1 text-xs text-[#8F8F93] hover:text-white transition-colors cursor-pointer">
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button onClick={() => setTestimonialDeleteTarget({ id: t.id, name: t.name })}
                            className="flex items-center gap-1 text-xs text-[#8F8F93] hover:text-red-400 transition-colors cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                      {/* Content */}
                      <p className="text-[#BDBDBD] text-sm leading-relaxed italic flex-1">
                        &ldquo;{t.content}&rdquo;
                      </p>
                      {/* Author */}
                      <div className="flex items-center gap-3 pt-4 border-t border-[#404040]">
                        <div className="w-9 h-9 rounded-full bg-[#C8A96E]/15 border border-[#C8A96E]/30 flex items-center justify-center shrink-0">
                          <span className="font-heading font-bold text-[#C8A96E] text-sm">{t.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold font-heading">{t.name}</p>
                          <p className="text-[#8F8F93] text-xs">{t.role}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Contact Requests ── */}
          {activeTab === "contact" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-heading font-bold text-white text-3xl mb-1">Contact Requests</h1>
                  <p className="text-[#8F8F93] text-sm">{contacts.length} total · {contacts.filter((c) => !c.read).length} unread</p>
                </div>
                <button onClick={fetchContacts} disabled={contactsLoading}
                  className="flex items-center gap-2 px-4 py-2 border border-[#404040] text-[#8F8F93] hover:text-white hover:border-[#8F8F93] text-sm rounded transition-all cursor-pointer">
                  <RefreshCw className={`w-4 h-4 ${contactsLoading ? "animate-spin" : ""}`} /> Refresh
                </button>
              </div>
              {contactsLoading ? (
                <div className="flex items-center justify-center h-40 text-[#8F8F93] text-sm gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Loading…
                </div>
              ) : contacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Mail className="w-10 h-10 mb-3 opacity-40 text-[#8F8F93]" />
                  <h2 className="font-heading font-semibold text-white text-xl mb-2">No contact requests yet</h2>
                  <p className="text-[#8F8F93] text-sm">Submissions from the contact form will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className={`bg-[#252525] border rounded-xl p-6 ${!c.read ? "border-[#C8A96E]/40" : "border-[#404040]"}`}>
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-heading font-semibold text-white text-base">{c.name}</h3>
                            {!c.read && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C8A96E]/20 text-[#C8A96E]">NEW</span>}
                            <span className="text-[#8F8F93] text-xs">{c.subject}</span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm mb-3">
                            <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-[#BDBDBD] hover:text-white transition-colors">
                              <Mail className="w-3.5 h-3.5 text-[#8F8F93]" />{c.email}
                            </a>
                            {c.phone && (
                              <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-[#BDBDBD] hover:text-white transition-colors">
                                <Phone className="w-3.5 h-3.5 text-[#8F8F93]" />{c.phone}
                              </a>
                            )}
                            <span className="flex items-center gap-1.5 text-[#8F8F93] text-xs">
                              <Clock className="w-3 h-3" />
                              {new Date(c.submittedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <p className="text-[#BDBDBD] text-sm leading-relaxed border-l-2 border-[#404040] pl-3">{c.message}</p>
                        </div>
                        <div className="flex lg:flex-col gap-2 lg:w-28 shrink-0">
                          <a href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject)}`}
                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/10 border border-[#404040] text-white hover:bg-white/20 text-xs font-semibold rounded-lg transition-colors">
                            <Mail className="w-3.5 h-3.5" /> Reply
                          </a>
                          <button onClick={() => handleDeleteContact(c.id)}
                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-[#404040] text-[#8F8F93] hover:text-red-400 hover:border-red-800/40 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Sell Car Requests ── */}
          {activeTab === "sell" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-heading font-bold text-white text-3xl mb-1">Sell Car Requests</h1>
                  <p className="text-[#8F8F93] text-sm">{listings.filter((l) => l.status === "pending").length} pending · {listings.length} total</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={fetchListings} disabled={listingsLoading}
                    className="flex items-center gap-2 px-4 py-2 border border-[#404040] text-[#8F8F93] hover:text-white hover:border-[#8F8F93] text-sm rounded transition-all cursor-pointer">
                    <RefreshCw className={`w-4 h-4 ${listingsLoading ? "animate-spin" : ""}`} /> Refresh
                  </button>
                  <button onClick={() => setActiveTab("listings")}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-[#1F1E1C] font-semibold text-sm rounded hover:bg-[#BDBDBD] transition-colors cursor-pointer">
                    Full Review View <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {listingsLoading ? (
                <div className="flex items-center justify-center h-40 text-[#8F8F93] text-sm gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Loading…
                </div>
              ) : listings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Truck className="w-10 h-10 mb-3 opacity-40 text-[#8F8F93]" />
                  <h2 className="font-heading font-semibold text-white text-xl mb-2">No sell requests yet</h2>
                  <p className="text-[#8F8F93] text-sm">Submissions from the Sell Your Car page will appear here.</p>
                </div>
              ) : (
                <div className="bg-[#252525] border border-[#404040] rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#404040]">
                          {["Vehicle", "Seller", "Mileage", "Condition", "Status", "Date"].map((h) => (
                            <th key={h} className="text-left text-[#8F8F93] text-xs font-medium uppercase tracking-wider px-5 py-3.5">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {listings.map((l) => (
                          <tr key={l.id} className="border-b border-[#404040] last:border-0 hover:bg-[#2A2A2A] transition-colors">
                            <td className="px-5 py-4">
                              <p className="text-white text-sm font-medium">{l.year} {l.make} {l.model}</p>
                              <p className="text-[#8F8F93] text-xs">{l.transmission} · {l.color || "—"}</p>
                            </td>
                            <td className="px-5 py-4">
                              <p className="text-white text-sm">{l.sellerName}</p>
                              <a href={`mailto:${l.sellerEmail}`} className="text-[#8F8F93] text-xs hover:text-white transition-colors">{l.sellerEmail}</a>
                            </td>
                            <td className="px-5 py-4 text-[#BDBDBD] text-sm">{Number(l.mileage).toLocaleString()} km</td>
                            <td className="px-5 py-4 text-[#BDBDBD] text-sm">{l.condition}</td>
                            <td className="px-5 py-4">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                l.status === "pending" ? "bg-[#C8A96E]/20 text-[#C8A96E]" :
                                l.status === "approved" ? "bg-green-900/40 text-green-400" :
                                "bg-red-900/40 text-red-400"
                              }`}>{l.status}</span>
                            </td>
                            <td className="px-5 py-4 text-[#8F8F93] text-xs">
                              {new Date(l.submittedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Media Library ── */}
          {activeTab === "media" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-heading font-bold text-white text-3xl mb-1">Media Library</h1>
                  <p className="text-[#8F8F93] text-sm">{mediaItems.length} image{mediaItems.length !== 1 ? "s" : ""} · hover to copy URL or delete</p>
                </div>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 border border-[#404040] text-[#8F8F93] hover:text-white hover:border-[#8F8F93] text-sm rounded transition-all cursor-pointer">
                    <Upload className="w-4 h-4" /> Upload
                    <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleUploadMedia(e.target.files)} />
                  </label>
                  <button onClick={() => setMediaAddOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#1F1E1C] font-semibold text-sm rounded hover:bg-[#BDBDBD] transition-colors cursor-pointer">
                    <Plus className="w-4 h-4" /> Add URL
                  </button>
                </div>
              </div>
              {mediaLoading ? (
                <div className="flex items-center justify-center h-40 text-[#8F8F93] text-sm gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Loading…
                </div>
              ) : mediaItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-[#404040] rounded-xl">
                  <ImageIcon className="w-12 h-12 mb-3 opacity-30 text-[#8F8F93]" />
                  <h2 className="font-heading font-semibold text-white text-xl mb-2">No images yet</h2>
                  <p className="text-[#8F8F93] text-sm mb-4">Upload images or add URLs to build your media library.</p>
                  <label className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#1F1E1C] font-semibold text-sm rounded hover:bg-[#BDBDBD] transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" /> Upload Images
                    <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleUploadMedia(e.target.files)} />
                  </label>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {mediaItems.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                      className="group bg-[#252525] border border-[#404040] rounded-xl overflow-hidden hover:border-[#8F8F93] transition-all">
                      <div className="aspect-square relative overflow-hidden bg-[#2A2A2A]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={() => { navigator.clipboard.writeText(item.url); showToast("URL copied!"); }}
                            className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors cursor-pointer"
                            title="Copy URL">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteMedia(item.id)}
                            className="w-9 h-9 bg-red-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/40 transition-colors cursor-pointer"
                            title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-white text-xs font-medium truncate mb-1">{item.name}</p>
                        <button onClick={() => { navigator.clipboard.writeText(item.url); showToast("URL copied!"); }}
                          className="text-[#8F8F93] text-[10px] truncate w-full text-left hover:text-white transition-colors cursor-pointer">
                          {item.url}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Add URL modal */}
              {mediaAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMediaAddOpen(false)} />
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="relative bg-[#252525] border border-[#404040] rounded-xl w-full max-w-sm p-7">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="font-heading font-bold text-white text-xl">Add Image URL</h2>
                      <button onClick={() => setMediaAddOpen(false)} className="text-[#8F8F93] hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className={labelCls}>Image URL *</label>
                        <input className={inputCls} placeholder="https://example.com/image.jpg" value={mediaUrlInput}
                          onChange={(e) => setMediaUrlInput(e.target.value)} autoFocus
                          onKeyDown={(e) => e.key === "Enter" && handleAddMediaUrl()} />
                      </div>
                      <div>
                        <label className={labelCls}>Label (optional)</label>
                        <input className={inputCls} placeholder="e.g. Toyota Camry front view" value={mediaNameInput}
                          onChange={(e) => setMediaNameInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddMediaUrl()} />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={() => setMediaAddOpen(false)}
                        className="flex-1 py-2.5 border border-[#404040] text-[#BDBDBD] text-sm rounded hover:border-[#8F8F93] hover:text-white transition-all cursor-pointer">
                        Cancel
                      </button>
                      <button onClick={handleAddMediaUrl} disabled={!mediaUrlInput.trim()}
                        className="flex-1 py-2.5 bg-white text-[#1F1E1C] font-semibold text-sm rounded hover:bg-[#BDBDBD] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Add Image
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {/* ── Users Tab ── */}
          {activeTab === "users" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-heading font-bold text-white text-2xl">Users</h2>
                  <p className="text-[#8F8F93] text-sm mt-1">{adminUsers.length} admin user{adminUsers.length !== 1 ? "s" : ""}</p>
                </div>
                <button onClick={() => setUserModal({ open: true, user: null })}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#1F1E1C] text-sm font-semibold rounded hover:bg-[#BDBDBD] transition-colors cursor-pointer">
                  <Plus className="w-4 h-4" /> Add User
                </button>
              </div>
              {usersLoading ? (
                <div className="flex items-center justify-center py-16"><RefreshCw className="w-6 h-6 text-[#8F8F93] animate-spin" /></div>
              ) : (
                <div className="bg-[#252525] border border-[#404040] rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#404040]">
                        {["Name", "Email", "Role", "Status", "Created", "Actions"].map((h) => (
                          <th key={h} className="text-left text-[#8F8F93] text-xs uppercase tracking-wider font-medium px-5 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers.map((u) => (
                        <tr key={u.id} className="border-b border-[#404040]/50 hover:bg-[#2A2A2A] transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#404040] flex items-center justify-center text-white font-semibold text-xs">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-white font-medium">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-[#BDBDBD]">{u.email}</td>
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 bg-[#C8A96E]/15 text-[#C8A96E] text-xs rounded-full font-medium">{u.role}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${u.status === "active" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-[#8F8F93]">{u.createdAt}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setUserModal({ open: true, user: u })}
                                className="p-1.5 text-[#8F8F93] hover:text-white hover:bg-[#404040] rounded transition-all cursor-pointer" title="Edit user">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => { setPwCurrent(""); setPwNew(""); setPwConfirm(""); setPwError(""); setPwModal({ open: true, userId: u.id, userName: u.name }); }}
                                className="p-1.5 text-[#8F8F93] hover:text-[#C8A96E] hover:bg-[#C8A96E]/10 rounded transition-all cursor-pointer" title="Set password">
                                <Lock className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteUser(u.id)}
                                className="p-1.5 text-[#8F8F93] hover:text-red-400 hover:bg-red-900/20 rounded transition-all cursor-pointer" title="Delete user">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {adminUsers.length === 0 && (
                        <tr><td colSpan={6} className="px-5 py-12 text-center text-[#8F8F93]">No users found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Roles Tab ── */}
          {activeTab === "roles" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-heading font-bold text-white text-2xl">Roles</h2>
                  <p className="text-[#8F8F93] text-sm mt-1">{roles.length} role{roles.length !== 1 ? "s" : ""} configured</p>
                </div>
                <button onClick={() => setRoleModal({ open: true, role: null })}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#1F1E1C] text-sm font-semibold rounded hover:bg-[#BDBDBD] transition-colors cursor-pointer">
                  <Plus className="w-4 h-4" /> Add Role
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((r) => {
                  const allSections = ["dashboard","vehicles","listings","brands","testimonials","contact","sell","media","users","roles","finance"];
                  return (
                    <div key={r.id} className="bg-[#252525] border border-[#404040] rounded-xl p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Shield className="w-4 h-4 text-[#C8A96E]" />
                            <h3 className="font-heading font-semibold text-white">{r.name}</h3>
                          </div>
                          <p className="text-[#8F8F93] text-xs">{r.description}</p>
                        </div>
                        <div className="flex gap-1.5 ml-4 shrink-0">
                          <button onClick={() => setRoleModal({ open: true, role: r })}
                            className="p-1.5 text-[#8F8F93] hover:text-white hover:bg-[#404040] rounded transition-all cursor-pointer">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteRole(r.id)}
                            className="p-1.5 text-[#8F8F93] hover:text-red-400 hover:bg-red-900/20 rounded transition-all cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="border-t border-[#404040] pt-3 mt-3">
                        <p className="text-[#8F8F93] text-xs uppercase tracking-wider mb-2 font-medium">Permissions ({r.permissions.length}/{allSections.length})</p>
                        <div className="flex flex-wrap gap-1.5">
                          {allSections.map((s) => (
                            <span key={s} className={`px-2 py-0.5 text-xs rounded ${r.permissions.includes(s) ? "bg-[#C8A96E]/15 text-[#C8A96E]" : "bg-[#333] text-[#666]"}`}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-[#8F8F93]">
                        {adminUsers.filter((u) => u.role === r.name).length} user(s) assigned
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Finance Applications ── */}
          {activeTab === "finance" && (
            <div>
              <div className="mb-6">
                <h2 className="font-heading font-bold text-white text-2xl">Finance Applications</h2>
                <p className="text-[#8F8F93] text-sm mt-1">{financeApps.length} application{financeApps.length !== 1 ? "s" : ""} received</p>
              </div>
              {financeAppsLoading ? (
                <div className="flex items-center gap-3 text-[#8F8F93]"><RefreshCw className="w-4 h-4 animate-spin" /><span className="text-sm">Loading…</span></div>
              ) : financeApps.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <CreditCard className="w-10 h-10 text-[#404040] mb-3" />
                  <p className="text-[#8F8F93] text-sm">No applications yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {financeApps.map((app) => (
                    <div key={app.id} className="bg-[#252525] border border-[#404040] rounded-xl p-5">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-heading font-semibold text-white text-base">{app.name}</h3>
                          <p className="text-[#8F8F93] text-xs mt-0.5">{new Date(app.submittedAt).toLocaleString("en-CA")}</p>
                        </div>
                        <span className="px-2.5 py-1 text-xs rounded-full bg-[#C8A96E]/15 text-[#C8A96E] font-medium shrink-0">New</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { l: "Email", v: app.email },
                          { l: "Phone", v: app.phone },
                          { l: "Employment", v: app.employmentStatus || "—" },
                          { l: "Annual Income", v: app.annualIncome ? `CAD ${Number(app.annualIncome).toLocaleString("en-CA")}` : "—" },
                          { l: "Vehicle Price", v: app.vehiclePrice ? `CAD ${Number(app.vehiclePrice).toLocaleString("en-CA")}` : "—" },
                          { l: "Term / Rate", v: app.requestedTerm ? `${app.requestedTerm} mo @ ${app.requestedRate}%` : "—" },
                        ].map(({ l, v }) => (
                          <div key={l} className="bg-[#2A2A2A] rounded-lg p-3">
                            <p className="text-[#8F8F93] text-[10px] uppercase tracking-wider mb-1">{l}</p>
                            <p className="text-white text-sm font-medium truncate">{v}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Finance Settings ── */}
          {activeTab === "finance-settings" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-heading font-bold text-white text-2xl">Finance Settings</h2>
                  <p className="text-[#8F8F93] text-sm mt-1">Configure default values shown on the Finance page</p>
                </div>
              </div>
              {financeLoading ? (
                <div className="flex items-center gap-3 text-[#8F8F93]"><RefreshCw className="w-4 h-4 animate-spin" /><span className="text-sm">Loading…</span></div>
              ) : (
                <div className="max-w-xl space-y-6">
                  <div className="bg-[#252525] border border-[#404040] rounded-xl p-6 space-y-5">
                    <h3 className="font-heading font-semibold text-white text-base mb-1">Interest Rate</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className={labelCls}>Default Rate (%)</label>
                        <input type="number" step="0.01" className={inputCls}
                          value={financeSettings.defaultRate}
                          onChange={(e) => setFinanceSettings((s) => ({ ...s, defaultRate: Number(e.target.value) }))} />
                      </div>
                      <div>
                        <label className={labelCls}>Min Rate (%)</label>
                        <input type="number" step="0.01" className={inputCls}
                          value={financeSettings.minRate}
                          onChange={(e) => setFinanceSettings((s) => ({ ...s, minRate: Number(e.target.value) }))} />
                      </div>
                      <div>
                        <label className={labelCls}>Max Rate (%)</label>
                        <input type="number" step="0.01" className={inputCls}
                          value={financeSettings.maxRate}
                          onChange={(e) => setFinanceSettings((s) => ({ ...s, maxRate: Number(e.target.value) }))} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#252525] border border-[#404040] rounded-xl p-6 space-y-5">
                    <h3 className="font-heading font-semibold text-white text-base mb-1">Calculator Defaults</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Default Term (months)</label>
                        <select className={inputCls + " cursor-pointer"}
                          value={financeSettings.defaultTerm}
                          onChange={(e) => setFinanceSettings((s) => ({ ...s, defaultTerm: Number(e.target.value) }))}>
                          {[24, 36, 48, 60, 72, 84].map((t) => <option key={t} value={t}>{t} months</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Default Vehicle Price (CAD)</label>
                        <input type="number" step="1000" className={inputCls}
                          value={financeSettings.defaultVehiclePrice}
                          onChange={(e) => setFinanceSettings((s) => ({ ...s, defaultVehiclePrice: Number(e.target.value) }))} />
                      </div>
                      <div>
                        <label className={labelCls}>Default Down Payment (CAD)</label>
                        <input type="number" step="500" className={inputCls}
                          value={financeSettings.defaultDeposit}
                          onChange={(e) => setFinanceSettings((s) => ({ ...s, defaultDeposit: Number(e.target.value) }))} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button onClick={handleSaveFinance} disabled={financeSaving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#1F1E1C] text-sm font-semibold rounded hover:bg-[#BDBDBD] transition-colors cursor-pointer disabled:opacity-60">
                      {financeSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {financeSaving ? "Saving…" : "Save Settings"}
                    </button>
                    {financeMsg && (
                      <span className={`text-sm ${financeMsg.startsWith("Failed") ? "text-red-400" : "text-green-400"}`}>{financeMsg}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Other tabs (placeholder) ── */}
          {activeTab !== "dashboard" && activeTab !== "vehicles" && activeTab !== "listings" && activeTab !== "brands" && activeTab !== "testimonials" && activeTab !== "contact" && activeTab !== "sell" && activeTab !== "media" && activeTab !== "users" && activeTab !== "roles" && activeTab !== "finance" && activeTab !== "finance-settings" && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-[#252525] border border-[#404040] rounded-xl flex items-center justify-center mb-4">
                {(() => {
                  const item = navItems.find((n) => n.id === activeTab);
                  const Icon = item?.icon || LayoutDashboard;
                  return <Icon className="w-7 h-7 text-[#8F8F93]" />;
                })()}
              </div>
              <h2 className="font-heading font-semibold text-white text-xl mb-2">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h2>
              <p className="text-[#8F8F93] text-sm">This section will be connected to the backend API.</p>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modal.open && (
          <VehicleModal
            vehicle={modal.vehicle}
            onSave={handleSave}
            onClose={() => setModal({ open: false, vehicle: null })}
          />
        )}
        {deleteTarget && (
          <DeleteConfirm
            name={`${deleteTarget.year} ${deleteTarget.make} ${deleteTarget.model}`}
            onConfirm={() => handleDelete(deleteTarget)}
            onCancel={() => setDeleteTarget(null)}
          />
        )}

        {/* Review listing modal */}
        {reviewModal.listing && reviewModal.action && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setReviewModal({ listing: null, action: null })} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative bg-[#252525] border border-[#404040] rounded-xl w-full max-w-md p-7">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                reviewModal.action === "approve" ? "bg-green-900/30 border border-green-800/50" : "bg-red-900/20 border border-red-800/40"
              }`}>
                {reviewModal.action === "approve"
                  ? <ThumbsUp className="w-6 h-6 text-green-400" />
                  : <ThumbsDown className="w-6 h-6 text-red-400" />
                }
              </div>
              <h3 className="font-heading font-bold text-white text-xl text-center mb-1">
                {reviewModal.action === "approve" ? "Approve Listing?" : "Reject Listing?"}
              </h3>
              <p className="text-[#8F8F93] text-sm text-center mb-5">
                {reviewModal.listing.year} {reviewModal.listing.make} {reviewModal.listing.model}
              </p>
              <div className="mb-5">
                <label className="block text-[#8F8F93] text-xs uppercase tracking-wider mb-2 font-medium">
                  Admin Note (optional)
                </label>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder={reviewModal.action === "approve"
                    ? "e.g. Vehicle looks great, will contact seller..."
                    : "e.g. Photos required, mileage unclear..."
                  }
                  className="w-full bg-[#2A2A2A] border border-[#404040] text-white placeholder-[#8F8F93] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#8F8F93] resize-none transition-colors"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setReviewModal({ listing: null, action: null })}
                  className="flex-1 py-2.5 border border-[#404040] text-[#BDBDBD] text-sm rounded-lg hover:border-[#8F8F93] hover:text-white transition-all cursor-pointer">
                  Cancel
                </button>
                <button
                  onClick={() => handleReviewListing(reviewModal.listing!, reviewModal.action!)}
                  className={`flex-1 py-2.5 font-semibold text-sm rounded-lg transition-colors cursor-pointer ${
                    reviewModal.action === "approve"
                      ? "bg-green-700 hover:bg-green-600 text-white"
                      : "bg-red-700 hover:bg-red-600 text-white"
                  }`}>
                  {reviewModal.action === "approve" ? "Approve" : "Reject"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Brand modal */}
        {brandModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setBrandModal({ open: false, brand: null })} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative bg-[#252525] border border-[#404040] rounded-xl w-full max-w-sm p-7">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-white text-xl">
                  {brandModal.brand ? "Edit Brand" : "Add Brand"}
                </h2>
                <button onClick={() => setBrandModal({ open: false, brand: null })} className="text-[#8F8F93] hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Brand Name *</label>
                  <input
                    className={inputCls}
                    placeholder="e.g. Toyota"
                    value={brandForm.name}
                    onChange={(e) => { setBrandForm((f) => ({ ...f, name: e.target.value })); setBrandFormError(""); }}
                    autoFocus
                  />
                </div>
                <div>
                  <label className={labelCls}>Vehicle Count</label>
                  <input
                    type="number"
                    min="0"
                    className={inputCls}
                    placeholder="0"
                    value={brandForm.count}
                    onChange={(e) => setBrandForm((f) => ({ ...f, count: e.target.value }))}
                  />
                  <p className="text-[#8F8F93] text-xs mt-1.5">Number shown on the homepage brand tile.</p>
                </div>
                {brandFormError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded px-3 py-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />{brandFormError}
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setBrandModal({ open: false, brand: null })}
                  className="flex-1 py-2.5 border border-[#404040] text-[#BDBDBD] text-sm rounded hover:border-[#8F8F93] hover:text-white transition-all cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleSaveBrand} disabled={brandSaving}
                  className="flex-1 py-2.5 bg-white text-[#1F1E1C] font-semibold text-sm rounded hover:bg-[#BDBDBD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  {brandSaving ? "Saving…" : brandModal.brand ? "Save Changes" : "Add Brand"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Brand delete confirm */}
        {brandDeleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setBrandDeleteTarget(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#252525] border border-[#404040] rounded-xl w-full max-w-sm p-7 text-center">
              <div className="w-14 h-14 bg-red-900/30 border border-red-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="font-heading font-bold text-white text-xl mb-2">Remove Brand?</h3>
              <p className="text-[#BDBDBD] text-sm mb-6">
                <span className="text-white font-semibold">{brandDeleteTarget.name}</span> will be removed from the brands list and homepage.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setBrandDeleteTarget(null)}
                  className="flex-1 py-2.5 border border-[#404040] text-[#BDBDBD] text-sm rounded hover:border-[#8F8F93] hover:text-white transition-all cursor-pointer">
                  Cancel
                </button>
                <button onClick={() => handleDeleteBrand(brandDeleteTarget.id, brandDeleteTarget.name)}
                  className="flex-1 py-2.5 bg-red-600 text-white font-semibold text-sm rounded hover:bg-red-700 transition-colors cursor-pointer">
                  Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Testimonial modal */}
        {testimonialModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setTestimonialModal({ open: false, item: null })} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative bg-[#252525] border border-[#404040] rounded-xl w-full max-w-lg p-7">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-white text-xl">
                  {testimonialModal.item ? "Edit Review" : "Add Review"}
                </h2>
                <button onClick={() => setTestimonialModal({ open: false, item: null })} className="text-[#8F8F93] hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Customer Name *</label>
                    <input className={inputCls} placeholder="Jane Smith" value={testimonialForm.name}
                      onChange={(e) => { setTestimonialForm((f) => ({ ...f, name: e.target.value })); setTestimonialFormError(""); }}
                      autoFocus />
                  </div>
                  <div>
                    <label className={labelCls}>Role / Label</label>
                    <input className={inputCls} placeholder="Happy Customer" value={testimonialForm.role}
                      onChange={(e) => setTestimonialForm((f) => ({ ...f, role: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Star Rating</label>
                  <div className="flex gap-2 mt-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} type="button" onClick={() => setTestimonialForm((f) => ({ ...f, rating: String(n) }))}
                        className="cursor-pointer transition-transform hover:scale-110">
                        <Star className={`w-7 h-7 transition-colors ${n <= Number(testimonialForm.rating) ? "fill-[#C8A96E] text-[#C8A96E]" : "text-[#404040]"}`} />
                      </button>
                    ))}
                    <span className="text-[#8F8F93] text-sm self-center ml-1">{testimonialForm.rating}/5</span>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Review Text *</label>
                  <textarea rows={4} className={inputCls + " resize-none"}
                    placeholder="Write the customer's review here..."
                    value={testimonialForm.content}
                    onChange={(e) => { setTestimonialForm((f) => ({ ...f, content: e.target.value })); setTestimonialFormError(""); }} />
                  <p className="text-[#8F8F93] text-xs mt-1">{testimonialForm.content.length} characters</p>
                </div>
                {testimonialFormError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded px-3 py-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />{testimonialFormError}
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setTestimonialModal({ open: false, item: null })}
                  className="flex-1 py-2.5 border border-[#404040] text-[#BDBDBD] text-sm rounded hover:border-[#8F8F93] hover:text-white transition-all cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleSaveTestimonial} disabled={testimonialSaving}
                  className="flex-1 py-2.5 bg-white text-[#1F1E1C] font-semibold text-sm rounded hover:bg-[#BDBDBD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  {testimonialSaving ? "Saving…" : testimonialModal.item ? "Save Changes" : "Add Review"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Testimonial delete confirm */}
        {testimonialDeleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setTestimonialDeleteTarget(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#252525] border border-[#404040] rounded-xl w-full max-w-sm p-7 text-center">
              <div className="w-14 h-14 bg-red-900/30 border border-red-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="font-heading font-bold text-white text-xl mb-2">Remove Review?</h3>
              <p className="text-[#BDBDBD] text-sm mb-6">
                The review by <span className="text-white font-semibold">{testimonialDeleteTarget.name}</span> will be permanently removed from the homepage.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setTestimonialDeleteTarget(null)}
                  className="flex-1 py-2.5 border border-[#404040] text-[#BDBDBD] text-sm rounded hover:border-[#8F8F93] hover:text-white transition-all cursor-pointer">
                  Cancel
                </button>
                <button onClick={() => handleDeleteTestimonial(testimonialDeleteTarget.id, testimonialDeleteTarget.name)}
                  className="flex-1 py-2.5 bg-red-600 text-white font-semibold text-sm rounded hover:bg-red-700 transition-colors cursor-pointer">
                  Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {toast && <Toast message={toast} onDone={() => setToast("")} />}

        {/* User Modal */}
        {userModal.open && (
          <UserModal
            user={userModal.user}
            roles={roles}
            onSave={handleSaveUser}
            onClose={() => setUserModal({ open: false, user: null })}
          />
        )}

        {/* Role Modal */}
        {roleModal.open && (
          <RoleModal
            role={roleModal.role}
            onSave={handleSaveRole}
            onClose={() => setRoleModal({ open: false, role: null })}
          />
        )}

        {/* Change Password Modal */}
        {pwModal.open && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#252525] border border-[#404040] rounded-xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-heading font-semibold text-white text-lg">Change Password</h3>
                  <p className="text-[#8F8F93] text-xs mt-0.5">{pwModal.userId ? `Setting password for ${pwModal.userName}` : "Update your admin login password"}</p>
                </div>
                <button onClick={() => setPwModal({ open: false, userId: null, userName: "" })}
                  className="text-[#8F8F93] hover:text-white transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                {!pwModal.userId && (
                  <div>
                    <label className="block text-[#8F8F93] text-[10px] uppercase tracking-wider mb-1.5 font-medium">Current Password</label>
                    <input type="password" value={pwCurrent} onChange={(e) => { setPwCurrent(e.target.value); setPwError(""); }}
                      placeholder="Enter current password"
                      className="w-full bg-[#2A2A2A] border border-[#404040] text-white placeholder-[#8F8F93] rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#8F8F93] transition-colors" />
                  </div>
                )}
                <div>
                  <label className="block text-[#8F8F93] text-[10px] uppercase tracking-wider mb-1.5 font-medium">New Password</label>
                  <input type="password" value={pwNew} onChange={(e) => { setPwNew(e.target.value); setPwError(""); }}
                    placeholder="At least 6 characters"
                    className="w-full bg-[#2A2A2A] border border-[#404040] text-white placeholder-[#8F8F93] rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#8F8F93] transition-colors" />
                </div>
                <div>
                  <label className="block text-[#8F8F93] text-[10px] uppercase tracking-wider mb-1.5 font-medium">Confirm New Password</label>
                  <input type="password" value={pwConfirm} onChange={(e) => { setPwConfirm(e.target.value); setPwError(""); }}
                    placeholder="Repeat new password"
                    className="w-full bg-[#2A2A2A] border border-[#404040] text-white placeholder-[#8F8F93] rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#8F8F93] transition-colors" />
                </div>
                {pwError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded px-3 py-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />{pwError}
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setPwModal({ open: false, userId: null, userName: "" })}
                  className="flex-1 py-2.5 border border-[#404040] text-[#8F8F93] text-sm rounded hover:text-white hover:border-[#8F8F93] transition-all cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleChangePassword} disabled={pwSaving}
                  className="flex-1 py-2.5 bg-white text-[#1F1E1C] font-semibold text-sm rounded hover:bg-[#BDBDBD] disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer">
                  {pwSaving ? "Saving…" : "Update Password"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
