// Script to handle Data Source toggling
console.log('Levered Index Synthesizer script loaded.');

document.addEventListener('DOMContentLoaded', () => {
  const dataSource = document.getElementById('dataSource');
  const zipControls = document.getElementById('zipControls');
  const econControls = document.getElementById('econControls');
  if (dataSource && zipControls && econControls) {
    dataSource.addEventListener('change', () => {
      const useEcon = dataSource.value === 'econ';
      zipControls.classList.toggle('hidden', useEcon);
      econControls.classList.toggle('hidden', !useEcon);
    });
  }
});
