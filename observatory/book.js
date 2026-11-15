(() => {
  // One lifecycle for public reading and local editing, including reduced motion.
  window.LabBook = {
    open(dialog) {
      dialog.classList.remove('closing');
      dialog.showModal();
    },
    close(dialog, after) {
      if (!dialog.open || dialog.classList.contains('closing')) return;
      let timer;
      const finish = () => {
        clearTimeout(timer);
        dialog.removeEventListener('animationend', ended);
        dialog.close();
        dialog.classList.remove('closing');
        after?.();
      };
      const ended = event => {
        if (event.target === dialog && event.animationName === 'book-lower') finish();
      };
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
      dialog.addEventListener('animationend', ended);
      dialog.classList.add('closing');
      // Still close if styles fail to load or animation is interrupted.
      timer = setTimeout(finish, 500);
    }
  };
})();
