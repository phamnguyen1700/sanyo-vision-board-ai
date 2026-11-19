"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export interface SearchableTableColumn<T> {
  key: string
  header: string
  cell: (row: T) => ReactNode
}

export interface InfiniteTableOptions {
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
}

interface SearchableDataTableProps<T> {
  rows: T[]
  columns: SearchableTableColumn<T>[]
  getRowKey: (row: T) => string
  getSearchText: (row: T) => string
  title?: string
  headerAction?: ReactNode
  toolbarEnd?: ReactNode
  searchPlaceholder?: string
  emptyMessage?: string
  onRowClick?: (row: T) => void
  isLoading?: boolean
  searchMode?: 'local' | 'server'
  searchValue?: string
  onSearchChange?: (value: string) => void
  infiniteScroll?: InfiniteTableOptions
}

export function SearchableDataTable<T>({
  rows,
  columns,
  getRowKey,
  getSearchText,
  title,
  headerAction,
  toolbarEnd,
  searchPlaceholder = 'Tìm kiếm',
  emptyMessage = 'Không có dữ liệu',
  onRowClick,
  isLoading = false,
  searchMode = 'local',
  searchValue,
  onSearchChange,
  infiniteScroll,
}: SearchableDataTableProps<T>) {
  const [search, setSearch] = useState('')
  const scrollRootRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const activeSearch = searchValue ?? search
  const normalizedSearch = activeSearch.trim().toLowerCase()
  const filteredRows = useMemo(
    () =>
      searchMode === 'local' && normalizedSearch
        ? rows.filter((row) => getSearchText(row).toLowerCase().includes(normalizedSearch))
        : rows,
    [getSearchText, normalizedSearch, rows, searchMode],
  )

  useEffect(() => {
    const sentinel = loadMoreRef.current
    const root = scrollRootRef.current
    if (!sentinel || !root || !infiniteScroll?.hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !infiniteScroll.isLoading) {
          infiniteScroll.onLoadMore()
        }
      },
      { root, rootMargin: '0px 0px 8rem' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [infiniteScroll])

  return (
    <div className="cms-common-data-table">
      {title ? (
        <div className="cms-common-data-table__header">
          <h2>{title}</h2>
          {headerAction ?? <span>{filteredRows.length} kết quả</span>}
        </div>
      ) : null}
      <div className="cms-common-data-table__toolbar">
        <div className="cms-common-data-table__search">
          <Input
            value={activeSearch}
            onChange={(event) => {
              const value = event.target.value
              setSearch(value)
              onSearchChange?.(value)
            }}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="cms-common-data-table__search-input"
          />
          {activeSearch ? (
            <button
              type="button"
              className="cms-common-data-table__clear"
              aria-label="Xóa nội dung tìm kiếm"
              onClick={() => {
                setSearch('')
                onSearchChange?.('')
              }}
            >
              <X />
            </button>
          ) : null}
        </div>
        {toolbarEnd ? (
          <div className="cms-common-data-table__toolbar-end">{toolbarEnd}</div>
        ) : null}
      </div>
      <div ref={scrollRootRef} className="cms-common-data-table__scroll">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <Skeleton className="cms-common-data-table__skeleton" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredRows.length ? (
              filteredRows.map((row) => (
                <TableRow
                  key={getRowKey(row)}
                  data-clickable={Boolean(onRowClick)}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key}>{column.cell(row)}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="cms-common-data-table__empty" colSpan={columns.length}>
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {infiniteScroll ? (
          <div ref={loadMoreRef} className="cms-common-data-table__load-more" aria-live="polite">
            {infiniteScroll.isLoading ? 'Đang tải thêm...' : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
