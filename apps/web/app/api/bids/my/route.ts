import { NextResponse } from 'next/server';

import { getBidHistory } from '@web/services/bids/server';
import { getAuthenticatedUser } from '@web/utils/auth/server';

/**
 * 사용자별 입찰 내역 조회 API
 * GET /api/bids/my
 */
export async function GET() {
  try {
    // 사용자 인증 확인
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    // 서비스 함수를 통한 입찰 내역 조회
    const bidHistory = await getBidHistory(authResult.userId!);

    return NextResponse.json(bidHistory);
  } catch (error) {
    console.error('입찰 내역 조회 오류:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: '입찰 내역 조회 중 오류가 발생했습니다' }, { status: 500 });
  }
}
