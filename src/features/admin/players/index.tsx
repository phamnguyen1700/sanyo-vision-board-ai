'use client'

import { useEffect, useMemo, useState } from 'react'

import { useAdminPlayerList, useAdminPlayerStats } from '@/hooks/admin'
import { PlayerStats } from './components/player-stats'
import { PlayerTable } from './components/player-table'

export function AdminPlayersFeature() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [marketingConsent, setMarketingConsent] = useState<boolean | null>(null)
  const [dataUsageConsent, setDataUsageConsent] = useState<boolean | null>(null)

  const statsQuery = useAdminPlayerStats()
  const playersQuery = useAdminPlayerList({
    search: search || undefined,
    marketingConsent: marketingConsent ?? undefined,
    dataUsageConsent: dataUsageConsent ?? undefined,
    pageSize: 10,
  })
  const players = useMemo(
    () => playersQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [playersQuery.data],
  )

  useEffect(() => {
    const timeout = window.setTimeout(() => setSearch(searchInput.trim()), 300)
    return () => window.clearTimeout(timeout)
  }, [searchInput])

  const clearFilters = () => {
    setSearchInput('')
    setSearch('')
    setMarketingConsent(null)
    setDataUsageConsent(null)
  }

  const toggleConsentFilter = (
    current: boolean | null,
    setter: (value: boolean | null) => void,
  ) => setter(current === true ? null : true)

  return (
    <section className="cms-player-page">
      <PlayerStats
        stats={statsQuery.data}
        marketingConsent={marketingConsent}
        dataUsageConsent={dataUsageConsent}
        onSelectMarketingConsent={() => toggleConsentFilter(marketingConsent, setMarketingConsent)}
        onSelectDataUsageConsent={() => toggleConsentFilter(dataUsageConsent, setDataUsageConsent)}
        isLoading={statsQuery.isLoading || statsQuery.isFetching}
      />
      <section className="cms-player-table-shell cms-glass">
        <PlayerTable
          rows={players}
          search={searchInput}
          marketingConsent={marketingConsent}
          dataUsageConsent={dataUsageConsent}
          onSearchChange={setSearchInput}
          onClearFilters={clearFilters}
          isLoading={playersQuery.isLoading || (playersQuery.isFetching && !playersQuery.isFetchingNextPage)}
          hasMore={playersQuery.hasNextPage}
          isLoadingMore={playersQuery.isFetchingNextPage}
          onLoadMore={() => playersQuery.fetchNextPage()}
        />
      </section>
    </section>
  )
}
