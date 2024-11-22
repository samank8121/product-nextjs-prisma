import { NextRequest, NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { getLocale } from '@/shared/utils/get-locale';

export function getLocaleFromRequest(request: NextRequest): string {
    return getLocale(request.headers.get('accept-language'));
  }
export async function getTranslationForNamespace(request: NextRequest, namespace: string) {
  const locale = getLocaleFromRequest(request);
  return await getTranslations({ locale, namespace });
}

export function jsonResponse(data: any, status: number = 200) {
    return NextResponse.json(data, { status });
}

export function errorResponse(error: string, status: number = 500) {
  return jsonResponse({ error }, status);
}
export function getDomain(locale: string, slug: string) {
  return `${process.env.DOMAIN}${locale}/${slug}`;
}