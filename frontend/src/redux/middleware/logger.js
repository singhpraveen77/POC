const frontendLogger = (store) => (next) => (action) => {
  if (action.type?.endsWith('/pending')) {
    console.log(`[Redux]  ${action.type}`, action.meta?.arg);
  } else if (action.type?.endsWith('/fulfilled')) {
    console.log(`[Redux]  ${action.type}`, action.payload);
  } else if (action.type?.endsWith('/rejected')) {
    console.error(`[Redux]  ${action.type}`, action.error || action.payload);
  } else {
    // console.log(`[Redux] ${action.type}`, action.payload);
  }
  return next(action);
};

export default frontendLogger;
