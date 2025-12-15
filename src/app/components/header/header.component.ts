import { Component, HostListener, inject, Renderer2, signal } from '@angular/core';
import { ContainerComponent } from "../container/container.component";
import { RouterLink } from "@angular/router";
import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ContainerComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  private doc: Document = inject(DOCUMENT);

  public menuState = signal<boolean>(true);
  #breakpointObserver = inject(BreakpointObserver);

  public isSmallScreen = signal<boolean>(false);

  #renderer = inject(Renderer2);
  ngOnInit(): void {
    //Chamará o metodo ao carregar o componente para poder setar se o tamanho da tela é maior que 767px
    this.onReSize();
  }

  @HostListener('window:resize') //Este decorador escuta o evento de redimensionamento da janela. Quando o evento ocorre, ele chama o método onResize passando o evento como argumento.
  onReSize() {
    //Irá setar true caso o tamanho da tela seja no maximo 375px e false se não for
    this.isSmallScreen.set(
      this.#breakpointObserver.isMatched('(max-width: 767px)')
    );

    if (!this.isSmallScreen()) {
      if (!this.menuState()) {
        this.openMenu();
      }
    } else {
      this.openMenu();
    }
  }



  public openMenu() {
    if (this.menuState()) {
      this.#renderer.addClass(this.doc.body, 'no-scroll');
    } else {
      this.#renderer.removeClass(this.doc.body, 'no-scroll');
    }
    this.menuState.set(!this.menuState());
  }

  openMenuMobile(): boolean {
    return( this.menuState() && this.isSmallScreen())? true: false
  }
}
