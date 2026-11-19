"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";

import { CmsField } from "@/components/common/cms-field";
import { Button } from "@/components/ui/button";
import { ApiError, getApiErrorMessage } from "@/lib/api/errors";
import type { AdminLoginRequest } from "@/types/auth.types";

interface AdminLoginCardProps {
  isSubmitting: boolean;
  error: unknown;
  onSubmit: (body: AdminLoginRequest) => void;
}

export function AdminLoginCard({
  isSubmitting,
  error,
  onSubmit,
}: AdminLoginCardProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const apiDetails = error instanceof ApiError ? error.details : undefined;
  const emailError = apiDetails?.find(
    (detail) => detail.field === "email",
  )?.message;
  const passwordError = apiDetails?.find(
    (detail) => detail.field === "password",
  )?.message;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setFormError("Vui lòng nhập email và mật khẩu.");
      return;
    }
    setFormError("");
    onSubmit({ email: email.trim(), password });
  };

  return (
    <main className="cms-admin-login-page">
      <section className="cms-admin-login-card cms-glass">
        <div className="cms-admin-login-card__brand">
          <img src="/sanyo-logo.png" alt="SANYO" />
        </div>
        <header className="cms-admin-login-card__header">
          <span className="cms-admin-login-card__title">ĐĂNG NHẬP VÀO CMS</span>
        </header>
        <form className="cms-admin-login-card__form" onSubmit={handleSubmit}>
          <CmsField
            id="admin-login-email"
            label="Email"
            value={email}
            variant="line"
            placeholder="Nhập email"
            autoComplete="email"
            error={emailError}
            onChange={setEmail}
          />
          <CmsField
            id="admin-login-password"
            label="Mật khẩu"
            type="password"
            value={password}
            variant="line"
            placeholder="Nhập mật khẩu"
            autoComplete="current-password"
            error={passwordError}
            onChange={setPassword}
          />
          {formError || (error && !emailError && !passwordError) ? (
            <p className="cms-admin-login-card__error">
              {formError || getApiErrorMessage(error, "Đăng nhập thất bại.")}
            </p>
          ) : null}
          <Button
            type="submit"
            className="cms-admin-login-card__submit"
            disabled={isSubmitting}
          >
            <LogIn />
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </section>
    </main>
  );
}
