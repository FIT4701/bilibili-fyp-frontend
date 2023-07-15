import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  @Input() currentPageTitle = "";
  @Input() previousLink = "";
  @Input() nextLink = "";

  activeButton: string = '';

  constructor(
    private route: ActivatedRoute) {
    }

  ngOnInit() {
    this.route.url.subscribe(url => {
      console.log(url)
      const activeRoute = url[0].path; 
      this.activeButton = activeRoute;
    });
  }
}
