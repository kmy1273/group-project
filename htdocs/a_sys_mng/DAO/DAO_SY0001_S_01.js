module.exports = (params) => {
  let sql = `
    SELECT
      A.global_kind AS global_kind,
      A.workplace_kind AS workplace_kind,
      A.sys_cd AS sys_cd,
      A.stt AS stt,
      A.sys_cd_nm AS sys_cd_nm,
      A.sys_cd_abbr_nm AS sys_cd_abbr_nm,
      A.hi_sys_cd AS hi_sys_cd,
      A.sys_cd_seq AS sys_cd_seq,
      A.reg_id AS reg_id,
      A.reg_date AS reg_date,
      A.reg_time AS reg_time
    FROM tbcm001m A
    WHERE 1=1
      AND A.global_kind = '${params.global_kind}'
  `;

  if (params.sys_cd) {
    sql += ` AND A.sys_cd LIKE '%${params.sys_cd}%' `;
  }

  if (params.sys_cd_nm) {
    sql += ` AND A.sys_cd_nm LIKE '%${params.sys_cd_nm}%' `;
  }

  sql += `
    ORDER BY A.sys_cd ASC
    LIMIT ${params.page_next}, ${params.page_row}
  `;

  return sql;
};
