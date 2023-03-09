import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import gsap from 'gsap';
import { environment } from 'src/environments/environment';
import { BusquedaService } from 'src/app/services/busqueda.service';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styles: [
  ]
})
export class BuscadorComponent implements OnInit {

  // Flags
  public showModalDatos = false;

  // Registro
  public registro: any;

  // Archivos para importacion
  public file: any;
  public archivoSubir: any;

  // Buscador
  public dni: string = '';

  public urlBase = environment.base_url;

  constructor(
    public authService: AuthService,
    private alertService: AlertService,
    private dataService: DataService,
    private busquedaService: BusquedaService
  ) { }

  ngOnInit(): void {
    gsap.from('.gsap-contenido', { y:100, opacity: 0, duration: .2 });
    this.dataService.ubicacionActual = 'Dashboard - Buscador';
  }

  // Capturando archivo de importacion
  capturarArchivo(event: any): void {
    if (event.target.files[0]) {
      // Se capatura el archivo
      this.archivoSubir = event.target.files[0];

      // Se verifica el formato - Debe ser un excel
      const formato = this.archivoSubir.type.split('/')[1];
      const condicion = formato !== 'vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      if (condicion) {
        this.file = null;
        this.archivoSubir = null;
        return this.alertService.info('Debes seleccionar un archivo de excel');
      }
    }
  }

  // Subir excel a plataforma
  subirArchivo(): void {

    if (!this.file) return this.alertService.info('Debe seleccionar un archivo de excel');

    this.alertService.question({ msg: '¿Quieres actualizar el archivo?', buttonText: 'Actualizar' })
    .then(({isConfirmed}) => {  
      if (isConfirmed) {
        this.alertService.loading();
    
        const formData = new FormData();
        formData.append('file', this.archivoSubir); // FormData -> key = 'file' y value = Archivo
    
        this.busquedaService.subirArchivo(formData).subscribe({
          next: () => {
            this.file = null;
            this.alertService.success('Archivo actualizado correctamente');
          },
          error: ({ error }) => this.alertService.errorApi(error.message)
        })
      }
    });
  }

  buscarRegistro(): void {

    if(!this.dni || this.dni.trim() === ''){
      this.alertService.info('Debe colocar un DNI');
      return;
    }

    this.alertService.loading();
    this.busquedaService.busquedaRegistro(this.dni).subscribe({
      next: ({ registro }) => {

        if(registro){
          this.registro = registro;
          this.showModalDatos = true;
          this.alertService.close();
        }else{
          this.registro = null;
          this.alertService.info('El registro no existe')
        }

        this.dni = '';

      }, error: ({error}) => this.alertService.errorApi(error.message)
    })
  }

}
