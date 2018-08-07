import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProductComponent } from './search-product.component';

describe('CustomerProductSearchComponent', () => {
  let component: SearchProductComponent;
  let fixture: ComponentFixture<SearchProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
