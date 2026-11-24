interface PlayerFilterProps {
  search: string
  marketingConsent: boolean | null
  dataUsageConsent: boolean | null
  onClear: () => void
}

export function PlayerFilter({ search, marketingConsent, dataUsageConsent, onClear }: PlayerFilterProps) {
  if (!search && marketingConsent === null && dataUsageConsent === null) return null

  return (
    <div className="cms-player-filter">
      {search ? <span className="cms-player-filter__badge">Tìm: {search}</span> : null}
      {marketingConsent === true ? <span className="cms-player-filter__badge">Đồng ý nhận thông tin</span> : null}
      {dataUsageConsent === true ? <span className="cms-player-filter__badge">Đồng ý lưu trữ dữ liệu</span> : null}
      <button type="button" className="cms-player-filter__clear" onClick={onClear}>Xóa bộ lọc</button>
    </div>
  )
}
