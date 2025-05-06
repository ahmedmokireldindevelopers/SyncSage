import { CheckHealthData, ExportProjectZipData } from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * @description Creates a ZIP archive of the project source code and returns it for download.
   * @tags stream, dbtn/module:project_export
   * @name export_project_zip
   * @summary Export Project Zip
   * @request GET:/routes/export-project-zip
   */
  export namespace export_project_zip {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ExportProjectZipData;
  }
}
