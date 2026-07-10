"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { QuizCategoryNav } from "@/components/layout/quiz-nav";

/**
 * Renders the category rail on document.body with position:fixed
 * so no layout ancestor can make it scroll with the page.
 */
export function FixedCategorySidebar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <aside className="quiz-sidebar-fixed no-scrollbar" aria-label="Categories">
      <QuizCategoryNav />
    </aside>,
    document.body
  );
}
