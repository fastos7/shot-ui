import { MatTableDataSource, MatPaginator } from "@angular/material";

/**
 * 
 * This class contains common method for converting data to a `MatTableDataSource`
 * which will be used to display data in `Material Table`. A component that uses
 * `Material Table` just needs to extend this class.
 * 
 * ### How to use:
 * 
 * #### 1.) Component
 * ```
 * export class AddBatchComponent extends MaterialDataSource
 * .
 * .
 * .
 *   constructor(...) { 
      super(); // Call super in the constructor
    }
 * ```
 * #### 2.) Template
 * 
 * ```
 *  <mat-table #table [dataSource]="convertToMaterialDatasource(batchList)">
 * ```
 * 
 * @author Marlon Cenita
 */
export class MaterialDataSource {
  /**
   * Returns a Material Data source.
   * 
   * @param datasource 
   */
  convertToMaterialDatasource(datasource:any,paginator?:MatPaginator) {  
    
    var matTableDataSource = new MatTableDataSource<any>(datasource);  
    if (paginator) {
      matTableDataSource.paginator = paginator;
    }
    return matTableDataSource;
  }

}
