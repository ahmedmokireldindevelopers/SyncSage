import { CheckHealthData, ExportProjectZipData } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * @description Creates a ZIP archive of the project source code and returns it for download.
   *
   * @tags stream, dbtn/module:project_export
   * @name export_project_zip
   * @summary Export Project Zip
   * @request GET:/routes/export-project-zip
   */
  export_project_zip = (params: RequestParams = {}) =>
    this.requestStream<ExportProjectZipData, any>({
      path: `/routes/export-project-zip`,
      method: "GET",
      ...params,
    });
}
