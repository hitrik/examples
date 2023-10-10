function mapArrayToHashByKey(list, key) {
  const ASSEMBLE_KEY = `_${key}s`;
  const listByKey = [];
  const DEFAULT_HASH = { [ASSEMBLE_KEY]: [] };

  if (!Array.isArray(list)) {
    return DEFAULT_HASH;
  }

  const hashByKey = list.reduce((output, item) => {

    const value = item?.[key];
    return value
      ? (listByKey.push(value), { ...output, [value]: item })
      : DEFAULT_HASH;
  }, {});

  Object.assign(hashByKey, { [ASSEMBLE_KEY]: listByKey });

  return hashByKey;
}