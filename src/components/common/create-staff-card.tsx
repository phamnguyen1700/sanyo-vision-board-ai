"use client";

import { useState, type FormEvent } from "react";

import { useCmsTheme } from "@/components/cms";
import { CmsField } from "@/components/common/cms-field";
import { LoadingSuccessOverlay } from "@/components/common/loading-success-overlay";
import { Button } from "@/components/ui/button";

import type { CreateAdminStaffInput } from "@/types/admin-staff.types";

type CreateStaffField = keyof CreateAdminStaffInput;
type CreateStaffErrors = Partial<Record<CreateStaffField, string>>;

interface CreateStaffCardProps {
  onBack: () => void;
  onSubmit: (input: CreateAdminStaffInput) => void;
  title?: string;
  isLoading?: boolean;
}

const initialValues: CreateAdminStaffInput = {
  email: "",
  password: "",
  confirmPassword: "",
};

export function CreateStaffCard({
  onBack,
  onSubmit,
  title = "Thêm quản trị viên",
  isLoading = false,
}: CreateStaffCardProps) {
  const { theme } = useCmsTheme();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<CreateStaffErrors>({});

  const updateField = (field: CreateStaffField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: CreateStaffErrors = {};
    const email = values.email.trim();

    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      nextErrors.email = "Vui lòng nhập email hợp lệ.";
    if (
      values.password.length < 8 ||
      !/[A-Z]/.test(values.password) ||
      !/[a-z]/.test(values.password) ||
      !/\d/.test(values.password)
    )
      nextErrors.password = "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số.";
    if (values.password !== values.confirmPassword)
      nextErrors.confirmPassword = "Mật khẩu nhập lại không trùng khớp.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit({ ...values, email: values.email.trim() });
  };

  return (
    <section
      className={`cms-create-staff-card cms-create-staff-card--${theme}`}
    >
      {isLoading ? <LoadingSuccessOverlay status="loading" label="Đang tạo tài khoản" /> : null}
      <header className="cms-create-staff-card__header">
        <h2>{title}</h2>
      </header>
      <form className="cms-create-staff-card__form" onSubmit={handleSubmit}>
        <CmsField
          id="create-staff-email"
          label="Email"
          type="email"
          value={values.email}
          variant="line"
          onChange={(value) => updateField("email", value)}
          placeholder="Nhập email quản trị viên"
          showLabel={false}
          autoComplete="email"
          error={errors.email}
        />
        <CmsField
          id="create-staff-password"
          label="Mật khẩu"
          type="password"
          value={values.password}
          variant="line"
          onChange={(value) => updateField("password", value)}
          placeholder="Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số"
          showLabel={false}
          autoComplete="new-password"
          error={errors.password}
        />
        <CmsField
          id="create-staff-confirm-password"
          label="Nhập lại mật khẩu"
          type="password"
          value={values.confirmPassword}
          variant="line"
          onChange={(value) => updateField("confirmPassword", value)}
          placeholder="Nhập lại mật khẩu"
          showLabel={false}
          autoComplete="new-password"
          error={errors.confirmPassword}
        />
        <footer className="cms-create-staff-card__footer">
          <Button type="button" variant="outline" onClick={onBack}>
            Quay lại
          </Button>
          <Button type="submit" className="cms-create-staff-card__submit">
            Tạo tài khoản
          </Button>
        </footer>
      </form>
    </section>
  );
}
