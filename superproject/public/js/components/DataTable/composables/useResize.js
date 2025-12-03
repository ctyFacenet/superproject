import { ref } from "vue";
import { DEFAULT_COLUMN_WIDTH, MIN_COLUMN_WIDTH } from "../composables/constants.js";

export default function useResize() {
  const colWidths = ref({});
  const resizing = ref({
    active: false,
    key: null,
    startX: 0,
    startWidth: 0,
  });

  function startResize(e, key) {
    e.preventDefault();

    resizing.value = {
      active: true,
      key,
      startX: e.pageX,
      startWidth: colWidths.value[key] || DEFAULT_COLUMN_WIDTH,
    };

    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", stopResize);
  }

  function handleResize(e) {
    if (!resizing.value.active) return;

    const delta = e.pageX - resizing.value.startX;

    colWidths.value[resizing.value.key] = Math.max(
      MIN_COLUMN_WIDTH,
      resizing.value.startWidth + delta
    );
  }

  function stopResize() {
    resizing.value.active = false;
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", stopResize);
  }

  const scrollWrapper = ref(null);
  const scrollLeft = ref(0);

  function handleScroll() {
    const el = scrollWrapper.value;
    if (el) scrollLeft.value = el.scrollLeft;
  }

  return {
    colWidths,
    resizing,
    startResize,
    handleResize,
    stopResize,
    scrollWrapper,
    scrollLeft,
    handleScroll,
  };
}
