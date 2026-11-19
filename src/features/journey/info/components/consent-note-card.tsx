'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { CampaignNoteCard } from '@/components/common/campaign'

export type ConsentValues = {
  privacy: boolean
  marketing: boolean
  research: boolean
}

type ConsentNoteCardProps = {
  value: ConsentValues
  onChange: (value: ConsentValues) => void
  showRequiredError?: boolean
}

const consentItems = [
  {
    key: 'privacy',
    content: <>Tôi đã đọc và đồng ý với <a href="#privacy">Thông báo Quyền riêng tư</a> của SANYO.</>,
  },
  {
    key: 'marketing',
    content: 'Tôi đồng ý nhận thông tin sản phẩm, khuyến mãi và sự kiện từ SANYO qua Zalo OA, SMS, hoặc điện thoại.',
  },
  {
    key: 'research',
    content: 'Tôi đồng ý để SANYO lưu trữ và sử dụng dữ liệu khảo sát của tôi cho các hoạt động chăm sóc khách hàng và nghiên cứu thị trường trong tương lai.',
  },
] as const

export function ConsentNoteCard({ value, onChange, showRequiredError = false }: ConsentNoteCardProps) {
  return (
    <CampaignNoteCard className="journey-consent-card">
      {consentItems.map((item) => (
        <label key={item.key} className="journey-consent-card__item">
          <Checkbox
            checked={value[item.key]}
            onCheckedChange={(checked) => onChange({ ...value, [item.key]: checked === true })}
            aria-label="Chọn điều khoản đồng ý"
          />
          <span>
            {item.content}
            {item.key === 'privacy' && showRequiredError && !value.privacy && (
              <small className="journey-consent-card__error">Vui lòng đồng ý để tiếp tục.</small>
            )}
          </span>
        </label>
      ))}
    </CampaignNoteCard>
  )
}
