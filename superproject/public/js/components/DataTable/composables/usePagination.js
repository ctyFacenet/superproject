import { ref, computed } from "vue";

export default function usePagination(filteredRows) {
  const currentPage = ref(1);
  const pageSize = ref(10);

  const pageSizeOptions = [
    { label: "10 / Trang", value: 10 },
    { label: "20 / Trang", value: 20 },
    { label: "50 / Trang", value: 50 },
    { label: "100 / Trang", value: 100 }
  ];

  const totalPages = computed(() =>
    Math.max(1, Math.ceil((filteredRows.value?.length || 0) / pageSize.value))
  );

  const paginatedRows = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredRows.value.slice(start, start + pageSize.value);
  });

  const goToPage = ref(null);

  function onPageSizeChange(size) {
    pageSize.value = size;
    currentPage.value = 1;
  }

  function jumpToPage() {
    if (goToPage.value >= 1 && goToPage.value <= totalPages.value)
      currentPage.value = goToPage.value;
  }

  return {
    currentPage,
    pageSize,
    pageSizeOptions,
    totalPages,
    paginatedRows,
    goToPage,
    onPageSizeChange,
    jumpToPage
  };
}
