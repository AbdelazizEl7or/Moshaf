import { takeWhile } from 'rxjs/operators';
import { ChangeDetectorRef, Component, ElementRef, HostListener, Injectable, NgZone, TemplateRef, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbDatepickerI18n, NgbModal, NgbOffcanvas, NgbOffcanvasOptions } from '@ng-bootstrap/ng-bootstrap';
import { Siras, Soars, Test, citys, rewayatWarsh } from './data';
import Swal from 'sweetalert2'
import { NbToastrService, NbWindowRef, } from '@nebular/theme';
import { DomSanitizer } from '@angular/platform-browser';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  NbThemeService
} from '@nebular/theme';
import { countries } from 'country-data-list';
// You can also use

const WEEKDAYS = ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];
const MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

@Injectable()
export class IslamicI18n extends NgbDatepickerI18n {
  getMonthShortName(month: number) {
    return MONTHS[month - 1];
  }

  getMonthFullName(month: number) {
    return MONTHS[month - 1];
  }

  getWeekdayLabel(weekday: number) {
    return WEEKDAYS[weekday - 1];
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [NgbActiveModal]
})
export class AppComponent {
  progressVal = 0
  progressStutes = ''
  temperatureOff: boolean = false
  currentV = 5
  thememe: any;
  test = false;
  Soars = Soars;
  Soars1 = Soars;
  Siras = Siras;
  Siras1 = Siras;
  buttonsSow = true;
  testQ = Test.flatMap(e => e.pageProps).flatMap(e => e.questions);
  currentIndex!: number;
  startLoad = true;
  bookShow = true;
  book!: any;
  pageI: number = 0
  Time: string = '--:--:--'
  nextPrar: string = '';
  windowWidht = window.innerWidth
  windowHight = window.innerHeight
  sdate = new Intl.DateTimeFormat('ar-TN-u-ca-islamic', { day: 'numeric', month: 'long', weekday: 'long', year: 'numeric' }).format(Date.now());
  s2date = new Intl.DateTimeFormat('ar-TN-u-ca', { day: 'numeric', month: 'long', weekday: 'long', year: 'numeric' }).format(Date.now());
  @ViewChild('audio') audio!: ElementRef<HTMLAudioElement>
  bodyhight = document.body.getBoundingClientRect().height;
  tafsers: {
    "id": number,
    "name": string,
    "language": string,
    "author": string,
    "book_name": string
  }[] = [];
  azkar: {
    "id": number,
    "category": string,
    "audio": string,
    "filename": string,
    "array": {
      "id": number,
      "text": string,
      "count": number,
      "audio": string,
      "filename": string
    }[
    ]
  }[] = [];
  azkargood: {
    "id": number,
    "category": string,
    "audio": string,
    "filename": string,
    "array": {
      "id": number,
      "text": string,
      "count": number,
      "audio": string,
      "filename": string
    }[
    ]
  }[] = [];
  ahadith:
    {
      "number": number,
      "arab": string
      "id": string
    }[] = [];
  ahadithsarch:
    {
      "number": number,
      "arab": string
      "id": string
    }[] = [];
  doaas = [];
  options: any = {
    width: this.windowWidht / 2.3 +"px",
    height: "600px",
    autoCenter: true,
    direction: "rtl",
    elevation: 5,
    when: {
      turning: (event: any, page: number, pageObject: any) => {
        this.getIPAGE(page);
        this.pageIndex = page;
      }
    }//https://cdn.islamic.network/quran/images/1_2.png
  }

  async getIPAGE(i: number) {
    var data = await (await fetch('http://api.alquran.cloud/v1/page/' + i + '/ar.asad')).json();
    this._snackBar.open('الجزء : ' + data.data.ayahs[0].juz + ' ربع الحزب : ' + ((data.data.ayahs[0].hizbQuarter) - ((data.data.ayahs[0].juz - 1) * 8)), 'إغلاق', {
      duration: 1000,
      panelClass: 'bg-info',
      horizontalPosition: 'right'
    });
  }

  isAthaning: boolean = false;
  currentZeekr!: {
    "id": number,
    "category": string,
    "audio": string,
    "filename": string,
    "array": {
      "id": number,
      "text": string,
      "count": number,
      "audio": string,
      "filename": string
    }[
    ]
  };
  currentSoura!: any;
  albitaqat!: any;
  Mawaqit!: { fagr: { Hours: number, Minutes: number }, shrock: { Hours: number, Minutes: number }, dohr: { Hours: number, Minutes: number }, asr: { Hours: number, Minutes: number }, magrep: { Hours: number, Minutes: number }, ashaa: { Hours: number, Minutes: number }, }







  _currentBookMarks: { id?: number, name: string, page: number }[] = [];
  public get currentBookMarks(): { id?: number, name: string, page: number }[] {
    return JSON.parse(localStorage.getItem("BookMarks") || '[]');
  }
  public set currentBookMarks(v: { id?: number, name: string, page: number }[]) {
    localStorage.setItem("BookMarks", JSON.stringify(v));
    this._currentBookMarks = v;
  }

  AddBookMark(name: string) {
    this._currentBookMarks = this.currentBookMarks
    this._currentBookMarks.push({ id: this._currentBookMarks.length + 1, name: name, page: this.pageIndex })
    this.currentBookMarks = this._currentBookMarks;
  }

  DeleteBookMark(id: number) {
    this._currentBookMarks = this.currentBookMarks
    this._currentBookMarks.splice(this._currentBookMarks.findIndex(e => e.id == id), 1)
    this.currentBookMarks = this._currentBookMarks;
  }

  UpdateBookMark(id: number) {
    Swal.fire({
      title: 'أكتب  الإسم',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      inputValue: this._currentBookMarks[this._currentBookMarks.findIndex(e => e.id == id)].name,
      showCancelButton: true,
      confirmButtonText: 'حفظ',
      cancelButtonText: 'إلغاء',
      inputAutoTrim: true,
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async (name) => {
        this._currentBookMarks[this._currentBookMarks.findIndex(e => e.id == id)].name = name
        this.currentBookMarks = this._currentBookMarks;

        Swal.fire({
          title: 'أكتب رقم الصفحة',
          input: 'number',
          inputAttributes: {
            autocapitalize: 'off',
          },
          showCancelButton: true,
          confirmButtonText: 'حفظ',
          cancelButtonText: 'إلغاء',
          inputValue: this._currentBookMarks[this._currentBookMarks.findIndex(e => e.id == id)].page,
          inputAutoTrim: true,
          reverseButtons: true,
          showLoaderOnConfirm: true,
          preConfirm: async (page) => {
            if (page <= 0 || page >= 605)
              Swal.showValidationMessage(
                'يجب كتابة رقم صفحة صحيح'
              )
            else
              this._currentBookMarks[this._currentBookMarks.findIndex(e => e.id == id)].page = page;
            this.currentBookMarks = this._currentBookMarks;
          }
        })
      }
    })
  }
  ookMark: any

  openBookMark(template: any) {
    this.ookMark = this.bottomSheet.open(template, {});
  }
  closebook() {
    this.ookMark.dismiss();
  }

  log(aa: any) {
    console.log(aa)
  }

  public get inV(): number {
    if (!localStorage.getItem("inV"))
      this.inV = this.currentV
    return localStorage.getItem("inV") ? parseInt(localStorage.getItem("inV")!) : this.currentV;
  }

  public set inV(v: number) {
    localStorage.setItem("inV", v.toString());
  }

  public get vi(): boolean {
    return this.inV == this.currentV
  }

  vv(i: number): boolean {
    return i <= this.inV
  }

  public get pageIndex(): number {
    return localStorage.getItem("pageIndex") ? parseInt(localStorage.getItem("pageIndex")!) : 2;
  }
  upv() {
    this.inV = this.currentV;
    history.go(0);
  }
  public set pageIndex(v: number) {
    localStorage.setItem("pageIndex", v.toString());
  }

  public get Zoom(): number {
    return localStorage.getItem("Zoom") ? parseInt(localStorage.getItem("Zoom")!) : this.mobileAndTabletCheck() ? 100 : 0;
  }
  public set Zoom(v: number) {
    localStorage.setItem("Zoom", v.toString());
  }

  public get opacity(): number {
    return localStorage.getItem("opacity") ? +localStorage.getItem("opacity")! : 0;
  }
  public set opacity(v: number) {
    localStorage.setItem("opacity", v.toString());
  }
  public get currentMoshaf(): number {
    return localStorage.getItem("currentMoshaf") ? parseInt(localStorage.getItem("currentMoshaf")!) : 3;
  }
  public set currentMoshaf(v: number) {
    localStorage.setItem("currentMoshaf", v.toString());
  }

  public get isSingle(): boolean {
    return localStorage.getItem("isSingle") ? localStorage.getItem("isSingle") == 'true' : true;
  }

  public set isSingle(v: boolean) {
    localStorage.setItem("isSingle", v.toString());
  }

  public get autoPlay(): boolean {
    return localStorage.getItem("autoPlay") == 'true';
  }

  public set autoPlay(v: boolean) {
    localStorage.setItem("autoPlay", v.toString());
  }

  public get azaned(): string {
    return localStorage.getItem("azaned")!;
  }

  public set azaned(v: string) {
    localStorage.setItem("azaned", v.toString());
  }

  public get currazane(): string {
    return localStorage.getItem("currazane") || "azan1";
  }

  public set currazane(v: string) {
    localStorage.setItem("currazane", v.toString());
  }

  public get tafsir(): number {
    return localStorage.getItem("tafsir") ? +localStorage.getItem("tafsir")! : 1;
  }

  public set tafsir(v: number) {
    localStorage.setItem("tafsir", v.toString());
  }

  public get first(): boolean {
    return localStorage.getItem("first") != 'true';
  }

  public set first(v: boolean) {
    localStorage.setItem("first", v.toString());
  }

  public get isfirst(): boolean {
    return localStorage.getItem("isfirst") == 'true';
  }

  public set isfirst(v: boolean) {
    localStorage.setItem("isfirst", v.toString());
  }

  public get loade(): boolean {
    return localStorage.getItem("loade") == 'true';
  }

  public set loade(v: boolean) {
    localStorage.setItem("loade", v.toString());
  }

  private _currentAudio: { id?: number, name?: string, url?: string, sora?: string, time?: number } = {};
  public get currentAudio(): { id?: number, name?: string, url?: string, sora?: string, time?: number } {
    if (!this._currentAudio.name)
      return JSON.parse(localStorage.getItem("audio") || '{"id":1,"name":"محمد صديق المنشاوي حفص عن عاصم","url":"https://quran.islamway.net/quran3/133/001.mp3","time":0,"sora":"الفاتحة"}');
    else
      return this._currentAudio;
  }
  public set currentAudio(v: { id?: number, name?: string, url?: string, sora?: string, time?: number }) {
    localStorage.setItem("audio", JSON.stringify(v));
    this._currentAudio = v;
  }

  public get location(): { country_name: string, state: string, city: string, latitude: string, longitude: string, IPv4: string } {
    return localStorage.getItem("location") ? JSON.parse(localStorage.getItem("location")!) : null;
  }
  public set location(v: { country_name: string, state: string, city: string, latitude: string, longitude: string, IPv4: string }) {
    localStorage.setItem("location", JSON.stringify(v));
  }

  public get theme(): 'corporate' | 'dark' | 'default' | 'cosmic' | 'pink' | 'blue' | 'red' | 'green' | "yellow" | 'cyan' {
    return (localStorage.getItem("theme") || "default" as any);
  }

  public set theme(v: 'corporate' | 'dark' | 'default' | 'cosmic' | 'pink' | 'blue' | 'red' | 'green' | "yellow" | 'cyan') {
    localStorage.setItem("theme", v);
  }
  isListOpen = true
  constructor(private offcanvasService: NgbOffcanvas, private modalService: NgbModal,
    public activeModal: NgbActiveModal, private ch: ChangeDetectorRef,
    public dom: DomSanitizer,
    private calendar: NgbCalendar,
    readonly bottomSheet: MatBottomSheet,
    private _snackBar: MatSnackBar,
    private nbThemeService: NbThemeService,
    private toastrService: NbToastrService

    //private windowService: NbWindowService
  ) {
   
    this.chageTheme(this.theme)
    console.log(this.nbThemeService.currentTheme)
    this._currentBookMarks = this.currentBookMarks
    console.log(this.inV)
    this.buttonsSow = !this.isSingle && this.windowWidht > 800
  }
  currday = '';
  selectedtheme: 'corporate' | 'dark' | 'default' | 'cosmic' | 'pink' | 'blue' | 'red' | 'green' | "yellow" | 'cyan' = 'default';
  chageTheme(text: 'corporate' | 'dark' | 'default' | 'cosmic' | 'pink' | 'blue' | 'red' | 'green' | "yellow" | 'cyan' = 'default') {
    $('body').removeClass('pink');
    $('body').removeClass('blue');
    $('body').removeClass('red');
    $('body').removeClass('green');
    $('body').removeClass('yellow');
    $('body').removeClass('cyan');
    if (text == 'corporate' || text == 'dark' || text == 'default' || text == 'cosmic') {
      this.nbThemeService.changeTheme(text);
    }
    else {
      this.nbThemeService.changeTheme("corporate");
      setTimeout(() => {
        $('body').addClass(text);
      }, 100);
    }
    this.theme = text
    localStorage.setItem("theme", text);
  }

  getDate() {
    console.log()
    fetch('https://api.aladhan.com/v1/gToH/' + this.Date.day + '-' + this.Date.month + '-' + this.Date.year).then(e =>
      e.json().then(e => {
        this.currday = 'يوم  ' + e.data.hijri.weekday.ar + ' ' + e.data.hijri.day + ' من شهر  ' + e.data.hijri.month.ar + ' لسنة  ' + e.data.hijri.year + ' هجرياََ '
      }))
  }
  changeZoom(Zooom: HTMLInputElement) {

    this.Zoom = +Zooom.value
    $('#imageing').css('width', Zooom.value + '%')
  }
  mobileAndTabletCheck() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||(window as any).opera);
    return check;
  };
  addoneToDun(i: string, good: boolean) {
    if (localStorage.getItem("DuneTest"))
      localStorage.setItem("DuneTest", localStorage.getItem("DuneTest")! + (good ? '[' + i + '],' : i + ','));
    else
      localStorage.setItem("DuneTest", good ? '[' + i + '],' : i + ',');

  }

  deleteAlldun(setting: any) {
    Swal.fire({
      title: 'هل أنت متأكد من أنك تريد حذف جميع الأسئلة؟',
      showCancelButton: true,
      confirmButtonText: 'حذف',
      cancelButtonText: `إلغاء`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          text: 'تم الحذف بنجاح',
          html: '',
          icon: 'success',
          confirmButtonText: 'حسناََ',
        });
        localStorage.setItem("DuneTest", '');
      } else {
        Swal.fire({
          text: 'لم يتم الحذف!',
          html: '',
          icon: 'success',
          confirmButtonText: 'حسناََ',
        })
      }
      this.openList(setting, 'end');
    })
  }

  getdoneToDun(i: number) {
    if (localStorage.getItem("DuneTest")) {
      var arr = localStorage.getItem("DuneTest")!.split(',');
      var el = arr?.find(e => e == this.testQ[i].question) || arr?.find(e => (e.replaceAll(']', '').replaceAll('[', '')) == this.testQ[i].question)
      if (el) {
        return el.startsWith('[') ? 'success' : 'danger';
      }
      else {
        return 'primary';
      }
    } else
      return 'primary';
  }

  shec() {
    if (this.currentopt == this.testQ[this.currentTestIndex].answer) {
      this.isCorrect = true;
      this.addoneToDun(this.testQ[this.currentTestIndex].question, true)
    }
    else {
      this.addoneToDun(this.testQ[this.currentTestIndex].question, false)
      this.isCorrect = false;
    }
  }
  showTool = true;
  goodone = 0
  badone = 0
  noone = 0;
  offline = false
  ngOnInit(): void {
    window.addEventListener('offline', (e) => {
      this.offline = true
    });
    window.addEventListener('online', (e) => {
      this.offline = false;
    });

    this.Time = ((new Date().getHours() + 11) % 12 + 1) + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
    window.onload = async () => {
      this.showTool = true;
      this.Time = ((new Date().getHours() + 11) % 12 + 1) + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
      window.onscroll = () => {
        this.showTool = window.scrollY < 60
      }
      this.testQ = this.testQ.map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      // this.speck(" مرحبا بك ");
      this.testQ.forEach((element, i) => {
        if (this.getdoneToDun(i) == 'primary')
          this.noone++
        if (this.getdoneToDun(i) == 'success')
          this.goodone++
        if (this.getdoneToDun(i) == 'danger')
          this.badone++
      });
      if(this.mobileAndTabletCheck())
      this.isSingle = true;
      if (!this.isSingle) {
        this.progressVal = 8
        this.progressStutes = 'المصحف'
        setTimeout(() => {
          this.Time = ((new Date().getHours() + 11) % 12 + 1) + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
          document.body.style.overflowY = "hidden"
          var book = $("#flipbook" + this.currentMoshaf) as any;
          if (this.currentMoshaf == 1)
            this.options.height = (this.windowHight / 1.6)+30 +"px";
          if (this.currentMoshaf == 3)
            this.options.height = (this.windowHight / 1.6)+130 +"px";
          if (this.currentMoshaf == 2)
            this.options.height = (this.windowHight / 1.6)+70 +"px";
          if (this.currentMoshaf == 5)
            this.options.height = (this.windowHight / 1.6) +"px";
          if (this.currentMoshaf == 4)
            this.options.height =(this.windowHight / 1.6) +"px";
          if (this.currentMoshaf == 5)
            this.options.height = (this.windowHight / 1.6) +"px";
          book.turn(this.options);
          for (let i = 1; i < 605; i++) {
            book.turn("addPage", `
               <div class="Page" >
                      <img src="${this.getMoshafUrl(i)}" style="width:98.5%" />
                    </div>`);
          };
          book.turn("addPage", `<div class="Page"> نهاية المصحف</div>`);
          setTimeout(() => {
            var page = this.pageIndex;
            if (window.innerWidth <= 800) {
              setTimeout(() => {
                this.progressVal = 10
                this.progressStutes = 'الذهاب للصفحة'
                book.turn("page", 1);
                setTimeout(() => {
                  book.turn("page", 2);
                  setTimeout(() => {
                    book.turn("page", 3);
                    setTimeout(() => {
                      book.turn("page", 4);
                      setTimeout(() => {
                        book.turn("page", 100);
                        setTimeout(() => {
                          book.turn("page", 300);
                          setTimeout(() => {
                            book.turn("page", (page).toString());
                          }, 100);
                        }, 200);
                      }, 100);
                    }, 100);
                  }, 100);
                }, 100);
              }, 100);

            } else
              book.turn("page", (page).toString());
          }, 500);
        }, 200);
      } else {
        document.body.style.overflow = 'auto'
        document.querySelector('html')!.style.overflow = 'auto'
      }
      this.Time = ((new Date().getHours() + 11) % 12 + 1) + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();

      this.bodyhight = document.body.getBoundingClientRect().height;
      var div = document.createElement("div");

      // https://github.com/Otang45/muslim-api
      if (!this.location) {
        this.progressVal = 70
        this.progressStutes = '  الموقع ومواقيت الصلاة'
        fetch('http://ip-api.com/json',{
          referrerPolicy: "unsafe-url"
        })
        .then((location) => {
          if (!this.isfirst) {
          /*   Swal.fire({
              icon: "info",
              text: "مرحباََ بك في موقع إسلام الذي يحتوي على 3 مصاحف و أكثر من 7 تفاسير للقران الكريم وأكثر من أربعة ألاف حديث من الاحاديث النبوية الشريفة مع أذكار ومواقيت للصلاة واذان حين يحين وقت الصلاة الخاص بك  مع القران الكريم بصوت عدد من المشايخ و أكثر من 700 سؤال إسلامي وغيرها من الأشياء",
              confirmButtonText: "حسنا"
            }); */
            this.isfirst = true;
          }
          location.json().then(async (location) => {
            document.body.click();
            document.body.click();
            console.log(location.country_name);
            console.log(location.state);
            console.log(location.city);
            console.log(location.latitude);
            console.log(location.longitude);
            console.log(location.IPv4);
            this.location = { country_name: await this.translate(location.country, 'ar', 'en'), state: await this.translate(location.regionName, 'ar', 'en'), city: await this.translate(location.city, 'ar', 'en'), latitude: location.lat, longitude: location.lon, IPv4: location.query }
            var prayTimes: any = (window as any).prayTimes.getTimes(new Date(), [location.lat, location.lon - 1]);
            this.Mawaqit = {
              fagr: { Hours: +prayTimes.fajr.split(":")[0], Minutes: +prayTimes.fajr.split(":")[1] },
              shrock: { Hours: +prayTimes.sunrise.split(":")[0], Minutes: +prayTimes.sunrise.split(":")[1] },
              dohr: { Hours: +prayTimes.dhuhr.split(":")[0], Minutes: +prayTimes.dhuhr.split(":")[1] },
              asr: { Hours: +prayTimes.asr.split(":")[0], Minutes: +prayTimes.asr.split(":")[1] },
              magrep: { Hours: +prayTimes.maghrib.split(":")[0], Minutes: +prayTimes.maghrib.split(":")[1] },
              ashaa: { Hours: +prayTimes.isha.split(":")[0], Minutes: +prayTimes.isha.split(":")[1] },
            }
            this.getNextPar()
            console.log(this.Mawaqit)
            setTimeout(() => {
              this.progressVal = 100
              this.progressStutes = ' النهاية '
              this.seti(this.audio.nativeElement)
              this.startLoad = false;
            }, 1500);
          })
        }).catch(e => {
          if (this.location) {
            var prayTimes: any = (window as any).prayTimes.getTimes(new Date(), [this.location.latitude, this.location.longitude]);
            this.Mawaqit = {
              fagr: { Hours: +prayTimes.fajr.split(":")[0], Minutes: +prayTimes.fajr.split(":")[1] },
              shrock: { Hours: +prayTimes.sunrise.split(":")[0], Minutes: +prayTimes.sunrise.split(":")[1] },
              dohr: { Hours: +prayTimes.dhuhr.split(":")[0], Minutes: +prayTimes.dhuhr.split(":")[1] },
              asr: { Hours: +prayTimes.asr.split(":")[0], Minutes: +prayTimes.asr.split(":")[1] },
              magrep: { Hours: +prayTimes.maghrib.split(":")[0], Minutes: +prayTimes.maghrib.split(":")[1] },
              ashaa: { Hours: +prayTimes.isha.split(":")[0], Minutes: +prayTimes.isha.split(":")[1] },
            }
            this.getNextPar();
          } else {
            history.go(0);
          }
          setTimeout(() => {
            this.progressVal = 100
            this.progressStutes = ' النهاية '
            this.seti(this.audio.nativeElement)
            this.startLoad = false;
          }, 1500);
        })
        /* Swal.fire({
          icon: "info",
          text: "هل يمكننا أخذ موقعك لتحديد مواقيت الصلاة ؟",
          confirmButtonText: 'حسناََ',
          showDenyButton: true,
          denyButtonText: 'لا'
        }).then(async e => {
          console.log((window as any).countryCoder)
          if (e.isDenied || e.isDismissed) {
            console.log(countries.all.map(({ name, alpha2 }) => ({ name, alpha2 })));
            var html = '<select class="form-select" style="direction:rtl" id="formNum"><option selected disabled> أختر  بلدك</option>'
            for (let i = 0; i < citys.length; i++) {
              const element = citys[i];
              if (element.cordos)
                html += `<option value="${element.alpha2}">${i + 1} - ${element.name}</option>`
            }
            console.log(citys)
            html += `</select><style>.swal2-input{    display: none !important;}</style>`;
            var num = 1;
            setTimeout(() => {
              $("#formNum").change((e) => { num = +$("#formNum").val()!; $("#swal2-input").val($("#formNum").val()!); })
            }, 100);
            Swal.fire({
              title: ' أختر  بلدك',
              input: 'text',
              html: html,
              inputAttributes: {
                autocapitalize: 'off',
              },
              showCancelButton: true,
              confirmButtonText: 'التالي',
              inputAutoTrim: true,
              cancelButtonText: 'إلغاء',
              showLoaderOnConfirm: true,
              reverseButtons: true,
              preConfirm: (e) => {
                num = e;
              },
              allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
              if (result.isConfirmed) {
                var all = citys.find(e => e.alpha2 == result.value)!
                this.location = { country_name: all.name, state: all.name, city: '', latitude: all.cordos?.lat + '', longitude: all.cordos?.long + '', IPv4: '000' }
                var prayTimes: any = (window as any).prayTimes.getTimes(new Date(), [all.cordos?.lat, all.cordos?.long! - 1]);
                this.Mawaqit = {
                  fagr: { Hours: +prayTimes.fajr.split(":")[0], Minutes: +prayTimes.fajr.split(":")[1] },
                  shrock: { Hours: +prayTimes.sunrise.split(":")[0], Minutes: +prayTimes.sunrise.split(":")[1] },
                  dohr: { Hours: +prayTimes.dhuhr.split(":")[0], Minutes: +prayTimes.dhuhr.split(":")[1] },
                  asr: { Hours: +prayTimes.asr.split(":")[0], Minutes: +prayTimes.asr.split(":")[1] },
                  magrep: { Hours: +prayTimes.maghrib.split(":")[0], Minutes: +prayTimes.maghrib.split(":")[1] },
                  ashaa: { Hours: +prayTimes.isha.split(":")[0], Minutes: +prayTimes.isha.split(":")[1] },
                }
                if (!this.isfirst) {
                  Swal.fire({
                    icon: "info",
                    text: "مرحباََ بك في موقع إسلام الذي يحتوي على 3 مصاحف و أكثر من 7 تفاسير للقران الكريم وأكثر من أربعة ألاف حديث من الاحاديث النبوية الشريفة مع أذكار ومواقيت للصلاة واذان حين يحين وقت الصلاة الخاص بك  مع القران الكريم بصوت عدد من المشايخ و أكثر من 700 سؤال إسلامي وغيرها من الأشياء",
                    confirmButtonText: "حسنا"
                  });
                  this.isfirst = true;
                }
              }
              setTimeout(() => {
                this.progressVal = 100
                this.progressStutes = ' النهاية '
                this.seti(this.audio.nativeElement)
                this.startLoad = false;
              }, 1500);
              this.toastrService.success("تم تحديد مواقيت الصلاة بنجاح")
            })

          }
          if (e.isConfirmed) {
            Swal.fire({
              icon: "success",
              text: "شكرا لك تم تحديد مواقيت الصلاة لك",
              confirmButtonText: 'حسناََ',
            })

          }
        }) */
      } else {
        /* if (!this.isfirst) {
          Swal.fire({
            icon: "info",
            text: "مرحباََ بك في موقع إسلام الذي يحتوي على 3 مصاحف و أكثر من 7 تفاسير للقران الكريم وأكثر من أربعة ألاف حديث من الاحاديث النبوية الشريفة مع أذكار ومواقيت للصلاة واذان حين يحين وقت الصلاة الخاص بك  مع القران الكريم بصوت عدد من المشايخ و أكثر من 700 سؤال إسلامي وغيرها من الأشياء",
            confirmButtonText: "حسنا"
          });
          this.isfirst = true;
        } */
        var prayTimes: any = (window as any).prayTimes.getTimes(new Date(), [this.location.latitude, (this.location.longitude as any) - 1]);
        this.Mawaqit = {
          fagr: { Hours: +prayTimes.fajr.split(":")[0], Minutes: +prayTimes.fajr.split(":")[1] },
          shrock: { Hours: +prayTimes.sunrise.split(":")[0], Minutes: +prayTimes.sunrise.split(":")[1] },
          dohr: { Hours: +prayTimes.dhuhr.split(":")[0], Minutes: +prayTimes.dhuhr.split(":")[1] },
          asr: { Hours: +prayTimes.asr.split(":")[0], Minutes: +prayTimes.asr.split(":")[1] },
          magrep: { Hours: +prayTimes.maghrib.split(":")[0], Minutes: +prayTimes.maghrib.split(":")[1] },
          ashaa: { Hours: +prayTimes.isha.split(":")[0], Minutes: +prayTimes.isha.split(":")[1] },
        }
        this.getNextPar()
        console.log(this.Mawaqit);
        this.progressVal = 90
        this.progressStutes = ' تحميل الصلاة القادمة'
        setTimeout(() => {
          this.progressVal = 100
          this.progressStutes = ' النهاية '
          this.seti(this.audio.nativeElement)
          this.startLoad = false;
        }, 1500);
      }
    };
  }
  nextPrarTime = '--:--:--'
  currentassmaPageI = 0
  assma = [];
  currentmohaderPageI = 0
  mohader = rewayatWarsh;
  surahsgood = []
  surahs = [];
  Date = this.calendar.getToday();
  ishig = false

  a3333(i: number) {
    let id = ''
    if (i.toString().length == 1)
      id = "00" + i
    if (i.toString().length == 2)
      id = "0" + i
    if (i.toString().length == 3)
      id = "" + i
    return id;
  }

  //https://www.codehim.com/carousel/3d-coverflow-effect-slider-with-jquery-flipster-carousel/
  getMoshafUrl(index: number) {
    switch (this.currentMoshaf) {
      case 1:
        return `https://quran.ksu.edu.sa/ayat/safahat1/${index}.png`;
        break;
      case 2:
        return `https://quran.ksu.edu.sa/tajweed_png/${index}.png`;
        break;
      case 3:
        return `https://quran.ksu.edu.sa/warsh/${index}.png`;
        break;
      case 4:
        return `https://easyquran.com/wp-content/uploads/2022/10/${index}-scaled.jpg`;
        break;
      case 5:
        return `https://easyquran.com/wp-content/HafsPages/images/${this.a3333(index)}.jpg`;
        break;
      default:
        return `https://quran.ksu.edu.sa/warsh/${index}.png`;
        break;
    }
  }

  tahdithalmoca() {
    fetch('http://ip-api.com/json')
      .then((location) => {
        location.json().then(async (location) => {
          document.body.click();
          document.body.click();
          console.log(location.country_name);
          console.log(location.state);
          console.log(location.city);
          console.log(location.latitude);
          console.log(location.longitude);
          console.log(location.IPv4);
          this.location = { country_name: await this.translate(location.country, 'ar', 'en'), state: await this.translate(location.regionName, 'ar', 'en'), city: await this.translate(location.city, 'ar', 'en'), latitude: location.lat, longitude: location.lon, IPv4: location.query }
          var prayTimes: any = (window as any).prayTimes.getTimes(new Date(), [location.lat, location.lon - 1]);
          this.Mawaqit = {
            fagr: { Hours: +prayTimes.fajr.split(":")[0], Minutes: +prayTimes.fajr.split(":")[1] },
            shrock: { Hours: +prayTimes.sunrise.split(":")[0], Minutes: +prayTimes.sunrise.split(":")[1] },
            dohr: { Hours: +prayTimes.dhuhr.split(":")[0], Minutes: +prayTimes.dhuhr.split(":")[1] },
            asr: { Hours: +prayTimes.asr.split(":")[0], Minutes: +prayTimes.asr.split(":")[1] },
            magrep: { Hours: +prayTimes.maghrib.split(":")[0], Minutes: +prayTimes.maghrib.split(":")[1] },
            ashaa: { Hours: +prayTimes.isha.split(":")[0], Minutes: +prayTimes.isha.split(":")[1] },
          }
          this.getNextPar();
          this.toastrService.success('تم تحديث الموقع بنجاح');
          console.log(this.Mawaqit)
          setTimeout(() => {
            this.seti(this.audio.nativeElement)
          }, 1500);
        })
      }).catch(e => {
        this.tahdithalmoca()
      })
  }


  //https://alquran.cloud/api
  open222(text: string, dial: any) {
  }
  changeMoshaf(i: number = 1, doa?: string): void {
    if (doa)
      history.go(0);
    if (i != this.currentMoshaf) {
      this.currentMoshaf = i;
      setTimeout(() => {
        history.go(0);
      }, 200);
    }
  }
  getNextPar() {
    if (this.Mawaqit.fagr.Hours >= new Date().getHours())
      this.nextPrar = 'الفجر'
    if (this.Mawaqit.dohr.Hours >= new Date().getHours() && this.Mawaqit.fagr.Hours <= new Date().getHours())
      this.nextPrar = 'الظهر'
    if (this.Mawaqit.asr.Hours >= new Date().getHours() && this.Mawaqit.dohr.Hours <= new Date().getHours())
      this.nextPrar = 'العصر'
    if (this.Mawaqit.magrep.Hours >= new Date().getHours() && this.Mawaqit.asr.Hours <= new Date().getHours())
      this.nextPrar = 'المغرب'
    if (this.Mawaqit.ashaa.Hours >= new Date().getHours() && this.Mawaqit.magrep.Hours <= new Date().getHours())
      this.nextPrar = 'العشاء'
  }
  openList(content: TemplateRef<any>, d: NgbOffcanvasOptions["position"]) {
    this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title', position: d, panelClass: ' animate__animated animate__jackInTheBox' }).result.then(
      (result) => {
        console.log(result)
      },
      (reason) => {
        console.log(reason)
      },
    );
    setTimeout(() => {
      $('.offcanvas').removeClass('animate__animated')
      $('.offcanvas').removeClass('animate__jackInTheBox')
    }, 1000);
  }
  goto(i: number) {
    this.getIPAGE(i);
    if (!this.isSingle) {
      var book = $("#flipbook" + this.currentMoshaf) as any;
      book.turn("page", (i + 1).toString());
    };
    if (this.isSingle)
      this.pageIndex = i;
    else
      this.pageIndex = i + 1;
  }
  SarchSoras(text: string) {
    text = text.replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g, '');
    //normalize Arabic
    text = text.replace(/(آ|إ|أ)/g, 'ا');
    text = text.replace(/(ة)/g, 'ه');
    text = text.replace(/(ئ|ؤ)/g, 'ء')
    text = text.replace(/(ى)/g, 'ي');
    //convert arabic numerals to english counterparts.
    var starter = 0x660;
    for (var i = 0; i < 10; i++) {
      text.replace(String.fromCharCode(starter + i), String.fromCharCode(48 + i));
    };
    if (text)
      this.Soars =
        this.Soars1.filter(e => this.fun((e.name as any).normalizeArabic()).includes((this.fun(text) as any).normalizeArabic()))
    else
      this.Soars
        = this.Soars1
  }

  SarchSiras(text: string) {
    this.currentSirasPageI = 0
    text = text.replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g, '');
    //normalize Arabic
    text = text.replace(/(آ|إ|أ)/g, 'ا');
    text = text.replace(/(ة)/g, 'ه');
    text = text.replace(/(ئ|ؤ)/g, 'ء')
    text = text.replace(/(ى)/g, 'ي');
    //convert arabic numerals to english counterparts.
    var starter = 0x660;
    for (var i = 0; i < 10; i++) {
      text.replace(String.fromCharCode(starter + i), String.fromCharCode(48 + i));
    };
    if (text)
      this.Siras =
        this.Siras1.filter(e => this.fun((e.name as any).normalizeArabic()).includes((this.fun(text) as any).normalizeArabic()))
    else
      this.Siras
        = this.Siras1
  }
  ayahs: any = []
  ayahsgood: any = []
  ayahsgoodI = 0
  Sarchsorah(text: string) {
    this.ayahsgoodI = 0;
    text = text.replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g, '');
    //normalize Arabic
    text = text.replace(/(آ|إ|أ)/g, 'ا');
    text = text.replace(/(ة)/g, 'ه');
    text = text.replace(/(ئ|ؤ)/g, 'ء')
    text = text.replace(/(ى)/g, 'ي');
    //convert arabic numerals to english counterparts.
    var starter = 0x660;
    for (var i = 0; i < 10; i++) {
      text.replace(String.fromCharCode(starter + i), String.fromCharCode(48 + i));
    };
    if (text)
      this.ayahs =
        this.ayahsgood.filter((e: any) => this.fun((e.text as any).normalizeArabic()).includes((this.fun(text) as any).normalizeArabic()))
    else
      this.ayahs
        = this.ayahsgood
  }
  SarchAthkar(text: string) {
    this.pageI = 0;
    text = text.replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g, '');
    //normalize Arabic
    text = text.replace(/(آ|إ|أ)/g, 'ا');
    text = text.replace(/(ة)/g, 'ه');
    text = text.replace(/(ئ|ؤ)/g, 'ء')
    text = text.replace(/(ى)/g, 'ي');
    //convert arabic numerals to english counterparts.
    var starter = 0x660;
    for (var i = 0; i < 10; i++) {
      text.replace(String.fromCharCode(starter + i), String.fromCharCode(48 + i));
    };
    if (text)
      this.azkar =
        this.azkargood.filter(e => this.fun(((e as any).category).normalizeArabic()).includes((this.fun(text) as any).normalizeArabic()))
    else
      this.azkar = this.azkargood
  }
  refresh() {
    this.azkar = this.azkargood
    this.ahadithsarch = this.ahadith
    this.Soars = this.Soars1
  }
  SarchAhadith(text: string) {
    this.pageI = 0;
    text = text.replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g, '');
    //normalize Arabic
    text = text.replace(/(آ|إ|أ)/g, 'ا');
    text = text.replace(/(ة)/g, 'ه');
    text = text.replace(/(ئ|ؤ)/g, 'ء')
    text = text.replace(/(ى)/g, 'ي');
    //convert arabic numerals to english counterparts.
    var starter = 0x660;
    for (var i = 0; i < 10; i++) {
      text.replace(String.fromCharCode(starter + i), String.fromCharCode(48 + i));
    };
    if (text)
      this.ahadithsarch =
        this.ahadith.filter(e => this.fun(((e as any).arabicText || (e as any).arab).normalizeArabic()).includes((this.fun(text) as any).normalizeArabic()))
    else
      this.ahadithsarch = this.ahadith
  }

  fun(text: string) {
    text = text.replaceAll(/(ٱ)/g, 'ا');
    text = text.replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g, '');
    //normalize Arabic
    text = text.replace(/(آ|إ|أ)/g, 'ا');
    text = text.replace(/(آ|إ|أ)/g, 'ا');
    text = text.replace(/(ة)/g, 'ه');
    text = text.replace(/(ئ|ؤ)/g, 'ء')
    text = text.replace(/(ى)/g, 'ي');
    //convert arabic numerals to english counterparts.
    var starter = 0x660;
    for (var i = 0; i < 10; i++) {
      text.replace(String.fromCharCode(starter + i), String.fromCharCode(48 + i));
    };
    return text.trim()
  }
  goUp(el: HTMLDivElement) {
    el.scrollTo(0, 0);
  }
  speck(t: string) {
    (window as any).responsiveVoice.speak(t, "Arabic Female", { volume: 1 });
  }
  windowRefAll!: NbWindowRef<any, any>
  windowRefone!: NbWindowRef<any, any>
  openTestDialog(dialogContent: TemplateRef<any>,) {
    //  this.buttonsSow = false;
    //  this.windowRefAll = this.windowService.open(dialogContent, { buttons: { close: true, fullScreen: true, maximize: true, minimize: true }, title: 'أسئلة إسلامية', hasBackdrop: true, closeOnBackdropClick: true, closeOnEsc: true, });
    //  this.bookShow = false

    //  this.windowRefAll.onClose.subscribe((visitor) => { this.buttonsSow = true; this.bookShow = true });
  }
  currentTestIndex = 1;
  currentPageI = 0;
  isCorrect: boolean | null = null;
  currentopt = "";
  SelectTestDialog(dialogContent: TemplateRef<any>, I: number) {
    this.currentTestIndex = I;
    // this.windowRefAll.minimize();
    //this.windowRefAll = this.windowService.open(dialogContent, { buttons: { close: true, fullScreen: true, maximize: true, minimize: true }, title: 'أسئلة إسلامية', hasBackdrop: true, closeOnBackdropClick: true, closeOnEsc: true, });
  }


  open2m(dialogContent: any, size = 'lg') {
    return this.modalService.open(dialogContent, { ariaLabelledBy: 'modal-basic-title', size: size, modalDialogClass: 'data-dialog' })
  }

  open2msor(dialogContent: any, index: number) {
    this.startLoad = true
    fetch('https://api.dikiotang.com/quran/surah/' + (index + 1)).then((r) => {
      r.json().then(e => {
        this.currentSoura = e.data;
        var ss = this.albitaqat.find((e: any) => e.id == index + 1)
        this.currentSoura.maeni_asamuha = ss.maeni_asamuha.replaceAll('ﷺ', '<div style="color:yellow">ﷺ</div>').replaceAll("الله", "<span style='color:red'>الله</span>").replaceAll("ألله", "<span style='color:red'>ألله</span>")
        this.currentSoura.sabab_tasmiatiha = ss.sabab_tasmiatiha.replaceAll('ﷺ', '<div style="color:yellow">ﷺ</div>').replaceAll("الله", "<span style='color:red'>الله</span>").replaceAll("ألله", "<span style='color:red'>ألله</span>")
        this.currentSoura.asmawuha = ss.asmawuha.replaceAll('ﷺ', '<div style="color:yellow">ﷺ</div>').replaceAll("الله", "<span style='color:red'>الله</span>").replaceAll("ألله", "<span style='color:red'>ألله</span>")
        this.currentSoura.sabab_nuzuliha = ss.sabab_nuzuliha.replaceAll('ﷺ', '<div style="color:yellow">ﷺ</div>').replaceAll("الله", "<span style='color:red'>الله</span>").replaceAll("ألله", "<span style='color:red'>ألله</span>")
        this.currentSoura.fadluha = ss.fadluha
        this.currentSoura.munasabatiha = ss.munasabatiha
        setTimeout(() => {
          this.translate(this.currentSoura.tafsir, 'ar').then(e => {
            this.currentSoura.tafsir = e.replaceAll("الله", "<span style='color:red'>الله</span>").replaceAll("ألله", "<span style='color:red'>ألله</span>");
            console.log(this.currentSoura)
            this.startLoad = false;
            this.modalService.open(dialogContent, { ariaLabelledBy: 'modal-basic-title', size: 'lg', modalDialogClass: 'data-dialog' })
          })
        }, 200);
      })
    })
  }

  closeAll() {
    this.modalService.dismissAll();
    this.offcanvasService.dismiss();
    $(".btn-close").click();
  }

  //http://praytimes.org/manual;
  //http://api.quran-tafseer.com/en/docs/;
  //https://github.com/topics/azkar-api;
  ////https://github.com/topics/hadith-api
  //////https://hadis-api-id.vercel.app/hadith/abu-dawud?page=2&limit=300;
  /////https://ayah.nawafdev.com/docs#/files/%D9%85%D8%B3%D8%A7%D8%B1_%D9%85%D9%84%D9%81_%D8%A7%D9%84%D8%A7%D8%B0%D9%83%D8%A7%D8%B1_files_adkar_json_get
  playAudio(i: number, dialogContent: any, ind: number) {
    this.goto(i);
    this.currentIndex = i;
    this.modalService.open(dialogContent, { ariaLabelledBy: 'modal-basic-title', size: 'lg', modalDialogClass: 'data-dialog' })
      .result.then(
        (result) => {
          this.closeAll();
          $('#el').toggle(100);
          if (this.first) {
            Swal.fire({
              title: "يمكنك التحكم في الصوت عن طريق الضغط على الزر الذي يحتوي على شكل صوت !",
              allowOutsideClick: false,
              icon: 'info',
              confirmButtonText: 'حسناً',
            });
            this.first = true;
          }
          ind++
          result.id = ind
          let id: string = "";
          if (ind.toString().length == 1)
            id = "00" + ind
          if (ind.toString().length == 2)
            id = "0" + ind
          if (ind.toString().length == 3)
            id = "" + ind
          result.url = result.url + id + ".mp3"
          result.sora = Soars[ind - 1].name;
          this.currentAudio = result;
          if (!this.test) {
            this.audio.nativeElement.autoplay = this.autoPlay;
            this.test = true
          }
        },
        (reason) => {
        },
      );
  }
  backone(a: HTMLAudioElement) {
    var ind: any = 1;
    if (this.currentAudio.id! - 1 == 0)
      ind = this.currentAudio.id
    else
      ind = this.currentAudio.id! - 1
    var result = this.currentAudio
    let id: string = "";
    if (ind.toString().length == 1)
      id = "00" + ind
    if (ind.toString().length == 2)
      id = "0" + ind
    if (ind.toString().length == 3)
      id = "" + ind
    result.url = this.currentAudio.url!.slice(0, -7) + id + ".mp3"
    a.src = result.url;
    result.id = ind;
    result.sora = Soars[ind - 1].name;
    this.currentAudio = result;
    a.autoplay = true;
    a.onload = () => {
      a.play();

    }
  }

  addone(a: HTMLAudioElement) {
    var ind: any = 1;
    if (this.currentAudio.id! + 1 > 114)
      ind = this.currentAudio.id
    else
      ind = this.currentAudio.id! + 1
    var result = this.currentAudio
    result.sora = Soars[ind - 1].name;
    let id: string = "";
    if (ind.toString().length == 1)
      id = "00" + ind
    if (ind.toString().length == 2)
      id = "0" + ind
    if (ind.toString().length == 3)
      id = "" + ind
    result.url = this.currentAudio.url!.slice(0, -7) + id + ".mp3"
    a.src = result.url;
    result.id = ind;
    this.currentAudio = result;
    a.autoplay = true;
    a.onload = () => {
      a.play();

    }
  }
  async seti(a: HTMLAudioElement) {
    if (this.azkar.length == 0) {
      this.progressVal = 15
      this.progressStutes = ' تحميل التفاسير'
      fetch('http://api.quran-tafseer.com/tafseer/')
        .then(r =>
          r.json().then(async d => {
            this.progressVal = 20
            this.progressStutes = ' تحميل الاذكار'
            this.azkargood = await ((await (fetch('./assets/Adhkar-json/adhkar.json'))).json());
            this.azkar = this.azkargood

            this.surahsgood = await ((await (fetch('./assets/all.json'))).json());
            this.progressVal = 30
            this.progressStutes = ' تحميل السور'
            this.surahs = this.surahsgood
            this.ayahsgood = this.surahsgood.flatMap((e: any) => e.ayahs)
            for (let i = 0; i < this.ayahsgood.length; i++) {
              const elementMMN = this.ayahsgood[i];
              var sorah: number = 0
              this.surahsgood.forEach((element: any) => {
                if (element.ayahs.find((e: any) => e.text == elementMMN.text))
                  sorah = element.number
              });
              this.ayahsgood[i].sorahNumber = sorah
            }
            this.ayahs = this.ayahsgood
            this.progressVal = 50
            this.progressStutes = ' تحميل الاحاديث'
            var e = await ((await (fetch('./assets/ahadith.json'))).json())
            this.albitaqat = await ((await (fetch('./assets/albitaqat.json'))).json())
            this.progressVal = 60
            this.progressStutes = ' تحميل الأدعية'
            this.doaas = await ((await (fetch('./assets/doaa.json'))).json())
            this.progressVal = 66
            this.progressStutes = ' تحميل اسماء الله احسنى'
            this.assma = await ((await (fetch('./assets/assma.json'))).json())
            this.mohader = rewayatWarsh
          //  var e2 = await ((await (fetch('https://api.dikiotang.com/hadits'))).json())
            this.ahadith = [...e.items];
            this.ahadithsarch = this.ahadith.map(value => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value);
            this.ahadith = this.ahadith.map(value => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value);
            this.tafsers = d;
          })
        )
    }
    a.onended = () => {
      var ind: any = 1;
      if (this.loade)
        ind = this.currentAudio.id!
      else
        if (parseInt(this.currentAudio.url!.slice(this.currentAudio.url!.length - 7, -4)) + 1 > 114)
          console.log("bad")
        else
          ind = this.currentAudio.id! + 1
      var result = this.currentAudio
      result.sora = Soars[ind - 1].name;
      let id: string = "";
      if (ind.toString().length == 1)
        id = "00" + ind
      if (ind.toString().length == 2)
        id = "0" + ind
      if (ind.toString().length == 3)
        id = "" + ind
      result.url = this.currentAudio.url!.slice(0, -7) + id + ".mp3"
      a.src = result.url;
      result.id = ind;
      this.currentAudio = result;
      a.play();
    }
    a.currentTime = this.currentAudio.time || 0;
    setInterval(() => {
      var e = this.currentAudio;
      e.time = a.currentTime
      this.getNextPar()
      var par = this.nextPrar == 'الفجر' ? this.Mawaqit.fagr : this.nextPrar == 'الظهر' ? this.Mawaqit.dohr : this.nextPrar == 'العصر' ? this.Mawaqit.asr : this.nextPrar == 'المغرب' ? this.Mawaqit.magrep : this.nextPrar == 'العشاء' ? this.Mawaqit.ashaa : this.Mawaqit.fagr
      var d = new Date(); //object of date()
      var hr = d.getHours();
      var min = d.getMinutes();
      var sec = d.getSeconds();
      const futureDate = new Date();
      futureDate.setHours(par.Hours);
      futureDate.setMinutes(par.Minutes);
      futureDate.setSeconds(0);
      const timeleft = futureDate.getTime() - new Date().getTime();
      const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
      this.nextPrarTime = hours + ':' + minutes + ":" + seconds;
      var hr_rotation = 30 * hr + min / 2; //converting current time
      var min_rotation = 6 * min;
      var sec_rotation = 6 * sec;
      if (document.querySelector('.hour-hand')) {
        (document.querySelector('.hour-hand')! as any).style.transform = `rotate(${hr_rotation + 88}deg)`;
        (document.querySelector('.min-hand')! as any).style.transform = `rotate(${min_rotation + 88}deg)`;
        (document.querySelector('.second-hand')! as any).style.transform = `rotate(${sec_rotation + 88}deg)`;
      }
      this.currentAudio = e;
      let H = new Date().getHours();
      let M = new Date().getMinutes();
      this.Time = ((new Date().getHours() + 11) % 12 + 1) + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();



      // if (12 + 3 == H && (44 <= M && M >= 44 && M <= 44 + 56)) {
      //   if (this.azaned != "Test") {
      //     this.isAthaning = true;
      //     this.speck('أذان')
      //     this.athan();
      //     this._snackBar.open('أذان Test', 'إغلاق', { panelClass: 'pannSnack' })
      //     this.azaned = "Test";
      //     Swal.fire({
      //       title: "Test",
      //       allowOutsideClick: false, html: `وقت الصلاة قد حان !, <img srcset="https://img.icons8.com/?size=256&amp;id=e8BeGrYrqZNI&amp;format=png 1x, https://img.icons8.com/?size=512&amp;id=e8BeGrYrqZNI&amp;format=png 1x" style="
      //       width: 32px;
      //       padding-left: 5px;
      //       padding-right: 5px;
      //   ">يمكنك إيقاف المؤذن من العلامة الموجودى يمين الصفحة ذات شكل القائمة `,
      //       icon: 'info',
      //       confirmButtonText: 'حسناً',
      //     }).then(e => {

      //     });
      //   }
      // }


      if (!this.isAthaning) {
        if (this.Mawaqit.fagr.Hours == H && (this.Mawaqit.fagr.Minutes <= M && M >= this.Mawaqit.fagr.Minutes && M <= this.Mawaqit.fagr.Minutes + 5)) {
          if (this.azaned != "fagr") {
            this.isAthaning = true;
            this.speck('أذان الفجر')
            this._snackBar.open('أذان الفجر', 'إغلاق', { panelClass: 'pannSnack' })
            this.azaned = "fagr";
            this.athan();
            Swal.fire({
              title: "الفجر",
              allowOutsideClick: false, html: `وقت الصلاة قد حان !, <img srcset="https://img.icons8.com/?size=256&amp;id=e8BeGrYrqZNI&amp;format=png 1x, https://img.icons8.com/?size=512&amp;id=e8BeGrYrqZNI&amp;format=png 1x" style="
              width: 32px;
              padding-left: 5px;
              padding-right: 5px;
          ">يمكنك إيقاف المؤذن من العلامة الموجودى يمين الصفحة ذات شكل القائمة `,
              icon: 'info',
              confirmButtonText: 'حسناً',
            }).then(e => {

            });
          }
        }
        if (this.Mawaqit.shrock.Hours == H && (this.Mawaqit.shrock.Minutes <= M && M >= this.Mawaqit.shrock.Minutes && M <= this.Mawaqit.shrock.Minutes + 5)) {
          if (this.azaned != "shrock") {
            this.isAthaning = true;
            // this.athan();
            this.azaned = "shrock";
            Swal.fire({
              title: "الشروق",
              allowOutsideClick: false,
              icon: 'info',
              confirmButtonText: 'حسناً',
            }).then(e => {
            })
          }
        }
        if (this.Mawaqit.dohr.Hours == H && (this.Mawaqit.dohr.Minutes <= M && M >= this.Mawaqit.dohr.Minutes && M <= this.Mawaqit.dohr.Minutes + 5)) {
          if (this.azaned != "dohr") {
            this.isAthaning = true;
            this.speck('أذان الظهر')
            this._snackBar.open('أذان الظهر', 'إغلاق', { panelClass: 'pannSnack' })
            this.athan();
            this.azaned = "dohr";
            Swal.fire({
              title: "الظهر",
              allowOutsideClick: false,
              icon: 'info',
              confirmButtonText: 'حسناً', html: `وقت الصلاة قد حان !, <img srcset="https://img.icons8.com/?size=256&amp;id=e8BeGrYrqZNI&amp;format=png 1x, https://img.icons8.com/?size=512&amp;id=e8BeGrYrqZNI&amp;format=png 1x" style="
              width: 32px;
              padding-left: 5px;
              padding-right: 5px;
          ">يمكنك إيقاف المؤذن من العلامة الموجودى يمين الصفحة ذات شكل القائمة `,
            }).then(e => {

            })
          }
        }
        if (this.Mawaqit.asr.Hours == H && (this.Mawaqit.asr.Minutes <= M && M >= this.Mawaqit.asr.Minutes && M <= this.Mawaqit.asr.Minutes + 5)) {
          if (this.azaned != "asr") {
            this.speck('أذان العصر')
            this._snackBar.open('أذان العصر', 'إغلاق', { panelClass: 'pannSnack' })
            this.isAthaning = true;
            this.athan();
            this.azaned = "asr";
            Swal.fire({
              title: "العصر",
              allowOutsideClick: false,
              icon: 'info',
              confirmButtonText: 'حسناً', html: `وقت الصلاة قد حان !, <img srcset="https://img.icons8.com/?size=256&amp;id=e8BeGrYrqZNI&amp;format=png 1x, https://img.icons8.com/?size=512&amp;id=e8BeGrYrqZNI&amp;format=png 1x" style="
              width: 32px;
              padding-left: 5px;
              padding-right: 5px;
          ">يمكنك إيقاف المؤذن من العلامة الموجودى يمين الصفحة ذات شكل القائمة `,
            }).then(e => {

            })
          }
        }
        if (this.Mawaqit.magrep.Hours == H && (this.Mawaqit.magrep.Minutes <= M && M >= this.Mawaqit.magrep.Minutes && M <= this.Mawaqit.magrep.Minutes + 5)) {
          if (this.azaned != "magrep") {
            this.speck('أذان المغرب')
            this._snackBar.open('أذان المغرب', 'إغلاق', { panelClass: 'pannSnack' })
            this.isAthaning = true;
            this.athan();
            this.azaned = "magrep";
            Swal.fire({
              title: "المغرب",
              allowOutsideClick: false,
              icon: 'info',
              confirmButtonText: 'حسناً', html: `وقت الصلاة قد حان !, <img srcset="https://img.icons8.com/?size=256&amp;id=e8BeGrYrqZNI&amp;format=png 1x, https://img.icons8.com/?size=512&amp;id=e8BeGrYrqZNI&amp;format=png 1x" style="
              width: 32px;
              padding-left: 5px;
              padding-right: 5px;
          ">يمكنك إيقاف المؤذن من العلامة الموجودى يمين الصفحة ذات شكل القائمة `,
            }).then(e => {

            })
          }
        }
        if (this.Mawaqit.ashaa.Hours == H && (this.Mawaqit.fagr.Minutes <= M && M >= this.Mawaqit.ashaa.Minutes && M <= this.Mawaqit.ashaa.Minutes + 5)) {
          if (this.azaned != "ashaa") {
            this.speck('أذان العشاء')
            this._snackBar.open('أذان العشاء', 'إغلاق', { panelClass: 'pannSnack' })
            this.isAthaning = true;
            this.athan();
            this.azaned = "ashaa";
            Swal.fire({
              title: "العشاء",
              allowOutsideClick: false,
              icon: 'info',
              confirmButtonText: 'حسناً', html: `وقت الصلاة قد حان !, <img srcset="https://img.icons8.com/?size=256&amp;id=e8BeGrYrqZNI&amp;format=png 1x, https://img.icons8.com/?size=512&amp;id=e8BeGrYrqZNI&amp;format=png 1x" style="
              width: 32px;
              padding-left: 5px;
              padding-right: 5px;
          ">يمكنك إيقاف المؤذن من العلامة الموجودى يمين الصفحة ذات شكل القائمة `,
            }).then(e => {

            })
          }
        }


      }
    }, 1000)
  }
  w = window.innerHeight
  currentAth!: HTMLAudioElement
  athan() {
    this.isAthaning = true;
    var er = true
    $('audio').toArray().forEach((element: any) => {
      if (!element.paused) {
        er = false
      }

    });
    if (er) {
      var a = new Audio("/assets/" + this.currazane + ".mp3");
      this.currentAth = a
      a.volume = 1
      a.autoplay = true;
      a.autofocus = false
      document.body.appendChild(a);
      a.onended = () => this.isAthaning = false;
      a.play();
    }
  }
  stop() {
    if (this.currentAth.paused) {
      this.currentAth.play();
    }
    else {
      this.currentAth.pause();
    }
  }
  openTafsir() {
    var html = '<select class="form-select" style="direction:rtl" id="formNum"><option selected disabled> أختر  السورة</option>'
    for (let i = 0; i < Soars.length; i++) {
      const element = Soars[i];
      html += `<option value="${i + 1}">${i + 1} - ${element.name}</option>`
    }
    html += `</select><style>.swal2-input{    display: none !important;}</style>`;
    var num = 1;
    setTimeout(() => {
      $("#formNum").change((e) => { num = +$("#formNum").val()!; $("#swal2-input").val(+$("#formNum").val()!); })
    }, 100);
    Swal.fire({
      title: ' أختر  السورة',
      input: 'number',
      html: html,
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'التالي',
      inputAutoTrim: true,
      cancelButtonText: 'إلغاء',
      showLoaderOnConfirm: true,
      reverseButtons: true,
      preConfirm: (e) => {
        if (e <= 0 || e >= 115)
          Swal.showValidationMessage(
            'يجب كتابة رقم سورة صحيح'
          )
        else
          num = e;
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'أكتب رقم الأية',
          input: 'number',
          inputAttributes: {
            autocapitalize: 'off',
          },
          showCancelButton: true,
          confirmButtonText: 'التفسير',
          cancelButtonText: 'إلغاء',
          inputAutoTrim: true,
          reverseButtons: true,
          showLoaderOnConfirm: true,
          preConfirm: async (aya) => {
            console.log(aya);
            var max = +this.albitaqat.find((e: any) => e.id == num).ayaatiha.slice(this.albitaqat.find((e: any) => e.id == num).ayaatiha.indexOf('(') + 1, this.albitaqat.find((e: any) => e.id == num).ayaatiha.indexOf(')'))
            console.log(max)
            if (+aya <= 0 || +aya > max) {
              Swal.showValidationMessage(
                'يجب كتابة رقم أية صحيح'
              )
            }
            else {
              try {
                this.startLoad = true
                return fetch(`http://api.quran-tafseer.com/tafseer/${this.tafsir}/${num}/${aya}`)
                  .then(response => {
                    return response.json()
                  }).catch(err => {
                    Swal.showValidationMessage(
                      'يجب كتابة رقم أية صحيح'
                    )
                  });
              } catch (error) {
              }
            }
            return Swal.showValidationMessage(
              'يجب كتابة رقم أية صحيح'
            )
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then(async (e) => {
          console.log(e)
          var aye = await (await fetch('https://api.dikiotang.com/quran/ayah/' + num + '/' + e.value.ayah_number)).json()
          this.startLoad = false
          Swal.fire({
            title: '<strong>التفسير</strong>',
            icon: 'info',
            customClass: 'w-90',
            html: "<div style='line-height: 1.7;'><div style='color:red;' class='mb-2'>" + aye.data[0].arab + "</div><br><h6>" + (e.value.tafseer_name) + "</h6><br>" + (e.value.text as string).replaceAll(".", ".<br>").replaceAll("الله", "<span style='color:red'>الله</span>").replaceAll("ألله", "<span style='color:red'>ألله</span>") + "</div>",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            reverseButtons: true,
            confirmButtonText:
              'إغلاق',
            confirmButtonAriaLabel: 'إغلاق',
          });
        })
      }
    })

  }

  openSouraTafsir(num: number) {
    var aya: any;
    Swal.fire({
      title: 'أكتب رقم الأية',
      input: 'number',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'التفسير',
      cancelButtonText: 'إلغاء',
      inputAutoTrim: true,
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: (aya) => {
        aya = aya
        console.log(aya);
        num++
        var max = +this.albitaqat.find((e: any) => e.id == num).ayaatiha.slice(this.albitaqat.find((e: any) => e.id == num).ayaatiha.indexOf('(') + 1, this.albitaqat.find((e: any) => e.id == num).ayaatiha.indexOf(')'))
        console.log(max)
        if (+aya <= 0 || +aya > max) {
          Swal.showValidationMessage(
            'يجب كتابة رقم أية صحيح'
          )
        }
        else {
          try {
            this.startLoad = true
            return fetch(`http://api.quran-tafseer.com/tafseer/${this.tafsir}/${num}/${aya}`)
              .then(response => {
                return response.json()
              }).catch(err => {
                Swal.showValidationMessage(
                  'يجب كتابة رقم أية صحيح'
                )
              });
          } catch (error) {
          }
        }
        return Swal.showValidationMessage(
          'يجب كتابة رقم أية صحيح'
        )
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(async (e) => {
      var aye = await (await fetch('https://api.dikiotang.com/quran/ayah/' + (num) + '/' + e.value.ayah_number)).json();
      this.startLoad = false
      Swal.fire({
        title: '<strong>التفسير</strong>',
        icon: 'info',
        customClass: 'w-90',
        html: "<div style='line-height: 1.7;'><div style='color:red;' class='mb-2'>(" + aye.data[0].arab + ")[" + e.value.ayah_number + "]</div><h6>" + (e.value.tafseer_name) + "</h6><br>" + (e.value.text as string).replaceAll(".", ".<br>").replaceAll("الله", "<span style='color:red'>الله</span>").replaceAll("ألله", "<span style='color:red'>ألله</span>") + "</div>",
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        reverseButtons: true,
        confirmButtonText:
          'إغلاق',
        confirmButtonAriaLabel: 'إغلاق',
      });
    })

  }


  translate(text: string, lang: string = "en", from = "auto",) {
    return fetch(
      'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + from + '&tl=' +
      lang +
      '&dt=t&ie=UTF-8&oe=UTF-8&q=' +
      encodeURIComponent(text),
      {
        method: 'GET',
      }
    ).then((i) => {
      return i.json().then((r) => {
        console.log(r[0][0][0]);
        return r[0][0][0] as string;
      });
    });
  }
  Swal(text: string) {
    return Swal.fire({
      icon: 'info',
      html: text,
      confirmButtonText: 'إغلاق',
    })
  }
  oddrtyen() {
    console.log(countries.all.map(({ name, alpha2 }) => ({ name, alpha2 })));
    var html = '<select class="form-select" style="direction:rtl" id="formNum"><option selected disabled> أختر  بلدك</option>'
    for (let i = 0; i < citys.length; i++) {
      const element = citys[i];
      if (element.cordos)
        html += `<option value="${element.alpha2}">${i + 1} - ${element.name}</option>`
    }
    console.log(citys)
    html += `</select><style>.swal2-input{    display: none !important;}</style>`;
    var num = 1;
    setTimeout(() => {
      $("#formNum").change((e) => { num = +$("#formNum").val()!; $("#swal2-input").val($("#formNum").val()!); })
    }, 100);
    Swal.fire({
      title: ' أختر  بلدك',
      input: 'text',
      html: html,
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'التالي',
      inputAutoTrim: true,
      cancelButtonText: 'إلغاء',
      showLoaderOnConfirm: true,
      reverseButtons: true,
      preConfirm: (e) => {
        if (e <= 0 || e >= 115)
          Swal.showValidationMessage(
            'يجب كتابة رقم سورة صحيح'
          )
        else
          num = e;
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        var all = citys.find(e => e.alpha2 == result.value)!
        this.location = { country_name: all.name, state: all.name, city: '', latitude: all.cordos?.lat + '', longitude: all.cordos?.long + '', IPv4: '000' }
        var prayTimes: any = (window as any).prayTimes.getTimes(new Date(), [all.cordos?.lat, all.cordos?.long! - 1]);
        this.Mawaqit = {
          fagr: { Hours: +prayTimes.fajr.split(":")[0], Minutes: +prayTimes.fajr.split(":")[1] },
          shrock: { Hours: +prayTimes.sunrise.split(":")[0], Minutes: +prayTimes.sunrise.split(":")[1] },
          dohr: { Hours: +prayTimes.dhuhr.split(":")[0], Minutes: +prayTimes.dhuhr.split(":")[1] },
          asr: { Hours: +prayTimes.asr.split(":")[0], Minutes: +prayTimes.asr.split(":")[1] },
          magrep: { Hours: +prayTimes.maghrib.split(":")[0], Minutes: +prayTimes.maghrib.split(":")[1] },
          ashaa: { Hours: +prayTimes.isha.split(":")[0], Minutes: +prayTimes.isha.split(":")[1] },
        }
      }
      setTimeout(() => {
        this.seti(this.audio.nativeElement)
      }, 1500);
      this.toastrService.success("تم تحديد مواقيت الصلاة بنجاح")
    })
  }
  openvidHadith(text: any, content: any) {
    Swal.fire({
      html: '<strong>' + text.name + '</strong><br><br>' +
        `<video id="my-video" class="video-js" controls autoplay preload="auto" style="width: 100%;height: 70%;"
      poster="https://img.icons8.com/?size=160&id=jJN9sKYGxjlS&format=png" data-setup="{}">
      <source src="${text.url}" type="video/mp4" />
    </video>` +
        '<br><br><p>' + text.man + '</p>',
      confirmButtonText: "إغلاق",
    }).then((e) => {

    })
  }
  currentSirasPageI = 0
  openvSirasHadith(item: {
    name: string;
    man: string;
    url: string;
    type: string;
    color?: 'primary' | 'info' | 'success' | 'warning' | 'danger';
  }, content: any) {
    var next = Siras[Siras.findIndex(e => e.url == item.url && e.name == item.name) + 1]
    var prev = Siras[Siras.findIndex(e => e.url == item.url && e.name == item.name) - 1]
    if (item.type != 'book') {
      let madia = item.type == 'book' ? ``
        : item.type == 'video' ? `<video src="${item.url}" controls autoplay preload="auto" style="width: 70%;"></video>`
          : item.type == 'audio' ? `<audio src="${item.url}" controls autoplay preload="auto" style="width: 100%;"></audio>`
            : ''
      Swal.fire(
        {
          html:
            '<div><strong style="color:red">' + item.name + '</strong></div>' +
            madia +
            '<br><br><br><h3>' + item.man + '</h3>',
          customClass: 'width-100',
          confirmButtonText: "التالي",
          showDenyButton: true,
          denyButtonText: 'السابق',
          showCloseButton: true,
        }
      ).then((e) => {
        if (e.isDismissed)
          this.open2m(content)
        else if (e.isConfirmed) {
          if (next)
            this.openvSirasHadith(next, content)
        } else if (e.isDenied) {
          if (prev)
            this.openvSirasHadith(prev, content)
        }
      })
    } else {
      var d = document.createElement('div');
      d.innerHTML = `
      <p id='close' style="color:white !important;position: fixed;left: 0;top: 0;z-index: 99999999999;display: flex;justify-content: center;width: 100%;"><span style="
    background-color: white;
    color: black;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0px 0px 20px 20px;
">إضغط في أي مكان خارج الكتاب للإغلاق</span></p> <div class='pop-pop'><iframe src='${item.url}' style='width: 80%;height: 90%;'></iframe></div>`
      document.body.append(d)
      $(".pop-pop").on('click', (e) => {
        e.stopPropagation();
        $(".pop-pop").fadeOut(200)
      })
      setTimeout(() => {
        $("#close").fadeOut(1000);
      }, 2000);

    }
  }
  //https://easyquran.com/wp-content/uploads/2022/10/https://easyquran.com/wp-content/HafsPages/images/
  urlSi = ''
  openHadith(text: string, content: any) {
    this.Swal(text).then(() => {
      this.open2m(content)
    })
  }
  openayah(item: any, content: any) {
    console.log(this.currentSoura)
    this.startLoad = true
    fetch(`http://api.quran-tafseer.com/tafseer/${this.tafsir}/${item.sorahNumber}/${item.numberInSurah}`)
      .then(response => {
        return response.json().then((e) => {
          this.startLoad = false
          Swal.fire(
            {
              html:
                '<strong style="color:red">' + item.text + '</strong>' +
                '<br><br><strong >رقم الصفحة : ' + item.page + '</strong>' +
                '<br><br><strong >رقمها في السوره : ' + item.numberInSurah + '</strong>' +
                '<br><br><strong >الجزء : ' + item.juz + '</strong>' +
                '<br><br><strong >الحزب رقم : ' + item.hizbQuarter + '</strong>' +
                '<br><br><strong >بها سجدة  : ' + (item.sajda ? 'نعم' : 'لا') + '</strong>' +
                '<br><br><strong >التفسير</strong>' +
                '<br><br><strong >' + e.text + '</strong>' +
                '<br><br><br><audio controls loop src="' + item.audio + '"> </audio>',
              confirmButtonText: 'الذهاب للصفحة',
              showCloseButton: true,
              showDenyButton: true,
              denyButtonText: 'إغلاق'
            }
          ).then((e) => {
            if (e.isConfirmed)
              this.goto(item.page);
            else
              this.open2m(content)
          });
        })
      }).catch(err => {
      })
  }
  openTagwid() {
    var html = '<select class="form-select" style="direction:rtl" id="formNum"><option selected disabled> أختر  السورة</option>'
    for (let i = 0; i < Soars.length; i++) {
      const element = Soars[i];
      html += `<option value="${i + 1}">${i + 1} - ${element.name}</option>`
    }
    html += `</select><style>.swal2-input{    display: none !important;}</style>`;
    var num = 1;
    setTimeout(() => {
      $("#formNum").change((e) => { num = +$("#formNum").val()!; $("#swal2-input").val(+$("#formNum").val()!); })
    }, 100);
    Swal.fire({
      title: ' أختر  السورة',
      input: 'number',
      html: html,
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'التالي',
      inputAutoTrim: true,
      cancelButtonText: 'إلغاء',
      showLoaderOnConfirm: true,
      reverseButtons: true,
      preConfirm: (e) => {
        if (e <= 0 || e >= 115)
          Swal.showValidationMessage(
            'يجب كتابة رقم سورة صحيح'
          )
        else
          num = e;
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'أكتب رقم الأية',
          input: 'number',
          inputAttributes: {
            autocapitalize: 'off',
          },
          showCancelButton: true,
          confirmButtonText: 'التفسير',
          cancelButtonText: 'إلغاء',
          inputAutoTrim: true,
          reverseButtons: true,
          showLoaderOnConfirm: true,
          preConfirm: async (aya) => {
            console.log(aya);
            var max = +this.albitaqat.find((e: any) => e.id == num).ayaatiha.slice(this.albitaqat.find((e: any) => e.id == num).ayaatiha.indexOf('(') + 1, this.albitaqat.find((e: any) => e.id == num).ayaatiha.indexOf(')'))
            console.log(max)
            if (+aya <= 0 || +aya > max) {
              Swal.showValidationMessage(
                'يجب كتابة رقم أية صحيح'
              )
            }
            else {
              try {
                return fetch(`http://api.alquran.cloud/v1/ayah/${num}:${aya}/quran-tajweed`)
                  .then(response => {
                    return response.json()
                  }).catch(err => {
                    Swal.showValidationMessage(
                      'يجب كتابة رقم أية صحيح'
                    )
                  });
              } catch (error) {
              }
            }
            return Swal.showValidationMessage(
              'يجب كتابة رقم أية صحيح'
            )
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then(async (e) => {
          console.log(e)
          var aye = await (await fetch('https://api.dikiotang.com/quran/ayah/' + num + '/' + e.value.ayah_number)).json()
          Swal.fire({
            title: '<strong>التجويد</strong>',
            icon: 'info',
            customClass: 'w-90',
            html: "<div style='line-height: 1.7;'><div style='color:red;' class='mb-2'>" + aye.data[0].arab + "</div><br><h6>" + (e.value.tafseer_name) + "</h6><br>" + (e.value.text as string).replaceAll(".", ".<br>").replaceAll("الله", "<span style='color:red'>الله</span>").replaceAll("ألله", "<span style='color:red'>ألله</span>") + "</div>",
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            reverseButtons: true,
            confirmButtonText: 'إغلاق',
            confirmButtonAriaLabel: 'إغلاق',
          });
        })
      }
    })

  }
  imageZoom(imgID: any, resultID: any) {
    var img: any, lens: any, result: any, cx: any, cy: any;
    img = document.getElementsByClassName('p' + this.pageIndex)[0].lastElementChild;
    result = document.getElementById(resultID);
    /*create lens:*/
    lens = document.createElement("DIV");
    lens.setAttribute("class", "img-zoom-lens");
    /*insert lens:*/
    img.parentElement.insertBefore(lens, img);
    /*calculate the ratio between result DIV and lens:*/
    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;
    /*set background properties for the result DIV:*/
    result.style.backgroundImage = "url('" + img.src + "')";
    result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
    /*execute a function when someone moves the cursor over the image, or the lens:*/
    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);
    /*and also for touch screens:*/
    lens.addEventListener("touchmove", moveLens);
    img.addEventListener("touchmove", moveLens);
    function moveLens(e: any) {
      var pos, x, y;
      /*prevent any other actions that may occur when moving over the image:*/
      e.preventDefault();
      /*get the cursor's x and y positions:*/
      pos = getCursorPos(e);
      /*calculate the position of the lens:*/
      x = pos.x - (lens.offsetWidth / 2);
      y = pos.y - (lens.offsetHeight / 2);
      /*prevent the lens from being positioned outside the image:*/
      if (x > img.width - lens.offsetWidth) { x = img.width - lens.offsetWidth; }
      if (x < 0) { x = 0; }
      if (y > img.height - lens.offsetHeight) { y = img.height - lens.offsetHeight; }
      if (y < 0) { y = 0; }
      /*set the position of the lens:*/
      lens.style.left = x + "px";
      lens.style.top = y + "px";
      /*display what the lens "sees":*/
      result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    }
    function getCursorPos(e: any) {
      var a, x = 0, y = 0;
      e = e || window.event;
      /*get the x and y positions of the image:*/
      a = img.getBoundingClientRect();
      /*calculate the cursor's x and y coordinates, relative to the image:*/
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /*consider any page scrolling:*/
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return { x: x, y: y };
    }
  }
}
//https://media.islamway.net/several/2112/12213/1.mp3
//https://ar.islamway.net/collection/16524/%D9%85%D8%B3%D8%A7%D9%82-%D8%A3%D8%B3%D8%A7%D8%B3%D9%8A%D8%A7%D8%AA-%D8%B1%D9%88%D8%A7%D9%8A%D8%A9-%D9%88%D8%B1%D8%B4-%D8%B9%D9%86-%D9%86%D8%A7%D9%81%D8%B9
//https://ar.islamway.net/video/83266/-4-%D8%B3%D9%88%D8%B1%D8%A9-%D8%A7%D9%84%D9%81%D8%A7%D8%AA%D8%AD%D8%A9-%D8%A8%D9%82%D8%B1%D8%A7%D8%A1%D8%A9-%D9%88%D8%B1%D8%B4?__ref=search
//https://ar.islamway.net/collection/19067/%D8%A3%D8%B5%D9%88%D9%84-%D8%B1%D9%88%D8%A7%D9%8A%D8%A9-%D9%88%D8%B1%D8%B4?__ref=search
//https://ar.islamway.net/collection/11139/%D8%A7%D9%84%D8%AA%D9%84%D8%A7%D9%88%D8%A9-%D8%A7%D9%84%D8%B5%D8%AD%D9%8A%D8%AD%D8%A9-%D8%A8%D8%B1%D9%88%D8%A7%D9%8A%D8%A9-%D9%88%D8%B1%D8%B4-%D8%B9%D9%86-%D9%86%D8%A7%D9%81%D8%B9-%D9%85%D8%B1%D8%A6%D9%8A?__ref=search
//https://ar.islamway.net/collection/16524/%D9%85%D8%B3%D8%A7%D9%82-%D8%A3%D8%B3%D8%A7%D8%B3%D9%8A%D8%A7%D8%AA-%D8%B1%D9%88%D8%A7%D9%8A%D8%A9-%D9%88%D8%B1%D8%B4-%D8%B9%D9%86-%D9%86%D8%A7%D9%81%D8%B9?__ref=search
//https://ar.islamway.net/video/83265/-3-%D8%B3%D9%85%D8%A7%D8%AA-%D9%82%D8%B1%D8%A7%D8%A1%D8%A9-%D9%88%D8%B1%D8%B4?__ref=search
//https://github.com/islamic-network/alquran-tools/blob/master/docs/tajweed.md
