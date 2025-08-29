import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  getBoardColumns,
  createBoardItem,
  type MondayColumn,
} from "../Mondayapi";

type SubmitState = "idle" | "success" | "error";

function parseLabels(col?: MondayColumn): string[] {
  if (!col?.settings_str) return [];
  try {
    const s = JSON.parse(col.settings_str);
    if (s.labels && !Array.isArray(s.labels))
      return Object.values(s.labels).filter(Boolean);
    if (Array.isArray(s.labels)) return s.labels.filter(Boolean);
    if (Array.isArray(s.options))
      return s.options.map((o: any) => o.name || o.title).filter(Boolean);
  } catch {}
  return [];
}

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    legalService: "",
    message: "",
  });
  const [columns, setColumns] = useState<MondayColumn[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitState>("idle");
  const [extraValues, setExtraValues] = useState<Record<string, any>>({});

  useEffect(() => {
    getBoardColumns().then(setColumns).catch(console.error);
  }, []);

  const emailCol = useMemo(() => columns.find((c) => c.type === "email"), [columns]);
  const phoneCol = useMemo(() => columns.find((c) => c.type === "phone"), [columns]);
  const messageCol = useMemo(
    () => columns.find((c) => c.type === "long_text" || /message|details|notes/i.test(c.title)),
    [columns]
  );
  const serviceCol = useMemo(
    () =>
      columns.find(
        (c) =>
          (c.type === "status" || c.type === "dropdown") &&
          /service|practice|matter|type/i.test(c.title)
      ),
    [columns]
  );

  const legalServiceOptions = useMemo(() => {
    const opts = parseLabels(serviceCol);
    return opts.length
      ? opts
      : [
          "Corporate Law",
          "Litigation",
          "Real Estate",
          "Employment Law",
          "Intellectual Property",
          "Family Law",
          "Other",
        ];
  }, [serviceCol]);

  const extraCols = useMemo(() => {
    const skip = new Set([
      emailCol?.id,
      phoneCol?.id,
      messageCol?.id,
      serviceCol?.id,
      "name",
    ]);
    return columns.filter(
      (c) =>
        !skip.has(c.id) &&
        !["creation_log", "last_updated", "world_clock", "auto_number", "date_created"].includes(
          c.type
        )
    );
  }, [columns, emailCol, phoneCol, messageCol, serviceCol]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExtraChange = (id: string, value: any) => {
    setExtraValues((prev) => ({ ...prev, [id]: value }));
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      legalService: "",
      message: "",
    });
    setExtraValues({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const columnValues: Record<string, any> = {};
      if (emailCol && formData.email) {
        columnValues[emailCol.id] = { email: formData.email, text: formData.email };
      }
      if (phoneCol && formData.phone) {
        columnValues[phoneCol.id] = { phone: formData.phone };
      }
      if (serviceCol && formData.legalService) {
        columnValues[serviceCol.id] = { label: formData.legalService };
      }
      if (messageCol && formData.message) {
        columnValues[messageCol.id] = formData.message;
      }
      for (const [id, val] of Object.entries(extraValues)) {
        columnValues[id] = val;
      }

      const itemName =
        `${formData.firstName} ${formData.lastName}`.trim() || formData.email || "Website Lead";

      const result = await createBoardItem(itemName, columnValues);
      if (result?.create_item?.id) {
        setSubmitStatus("success");
        resetForm();
      } else {
        throw new Error("Create item failed");
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const officeInfo = [
    {
      city: "Nairobi Office",
      address: "Upper Hill, ABC Place, 5th Floor\nWaiyaki Way, Nairobi",
      phone: "+254 700 123 456",
      email: "Info@soklaw.co.ke",
    },
  ];

  return (
    <section ref={sectionRef} id="contact" className="py-20 bg-white">
      {/* … trimmed UI (same as yours, just fix hrefs and CSS template strings) */}
      <style jsx>{`
        .animate-on-scroll {
          transition: all 0.6s ease-out;
          transform: translateY(20px);
        }
        .animate-fade-in-up {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </section>
  );
};

export default Contact;
